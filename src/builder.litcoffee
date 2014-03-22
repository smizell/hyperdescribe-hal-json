# Converting from Hyperdescribe to HAL+JSON

HAL has four different hypermedia elements:

1. Entities
2. Properties
3. Transitions
4. Embedded entities

This document will cover these elements in this order.

## Entities

HAL has an entity at it's root.

    propertyTypes = 
      integer: parseInt
      boolean: (property) -> if property == 'true' then true else false
      float: parseFloat

    mapToHal = module.exports = (hyperdescribe) ->
      mapEntity(hyperdescribe.hyperdescribe)

    mapEntity = (entity) ->
      if entity.content?.properties?
        newEntity = mapProperties(entity.content.properties)
      else
        newEntity = {}
      
      newEntity._links = mapLinks(entity.content.transitions) if entity.content?.transitions?
      if newEntity._links?
        newEntity._links.self = getSelfLink(entity) unless newEntity._links.self?
      
      if entity.content?.entities?
        embedded = getEmbedded(entity.content.entities)
        newEntity._embedded = mapEmbedded(embedded) if embedded.length > 0
        extraProperties = mapExtraProperties(entity.content.entities)

        for extra in Object.keys(extraProperties)
          newEntity[extra] = extraProperties[extra]

      newEntity

    getSelfLink = (entity) ->
      [{ href: entity.url }]

    mapProperties = (properties) ->
      properties.reduce (properties, property) ->
        properties[property.name] = getPropertyValue(property)
        properties
      , {}

Hyperdescribe allows for entities that do not have URLs or link relations. This allows for nesting properties in plain old JSON. 

    mapExtraProperties = (entities) ->
      extras = entities.filter (entity) ->
        !entity.url? and !entity.rels? and entity.property? and entity.content?

      extras.reduce (extraObj, extra) ->
        extraObj[extra.property] = mapProperties(extra.content.properties)

        if extra.content.entities?
          extraExtra = mapExtraProperties(extra.content.entities)

          for extra2 in Object.keys(extraExtra)
            extraObj[extra.property][extra2] = extraExtra[extra2]

        extraObj
      , {}

    getPropertyValue = (property) ->
      if property.type? and property.type != 'text'
        return propertyTypes[property.type](property.value)
      return String(property.value)

    getRel = (obj) ->
      obj.rels.join(" ")

    mapObject = (items) ->
      items.reduce (itemObj, item) ->
        rel = getRel(item)
        itemObj[rel] = [] unless rel in itemObj
        itemObj
      , {}

There are two reserved property names:

* `_links` - which is an object of links
* `_embedded` - which is an object of entities

While each of these are objects, their properities MAY be arrays. To stay consistent, we will always treat these as arrays.

## Links

A link in Hyperdescribe for HAL will be a safe, non-idempotent link.

    mapLinks = (transitions) ->
      links = transitions.filter (transition) ->
        (transition.method?.valueOf() == 'GET' or !transition.method?) and transition.rels?

      links.reduce (linkObj, link) ->
        rel = getRel(link)
        halLink = { href: link.url }
        halLink.templated = true if link.isTemplated

        linkObj[rel].push(halLink)
        linkObj
      , mapObject(links)

Embedded items must have a link relation and a URL to be considered an embedded entity.

    getEmbedded = (entities) ->
      entities.filter (entity) -> entity.rels?.length? and entity.url?

    mapEmbedded = (embedded) ->
      embedded.reduce (entityObj, entity) ->
        rel = getRel(entity)
        entityObj[rel].push(mapEntity(entity))
        entityObj
      , mapObject(embedded)

