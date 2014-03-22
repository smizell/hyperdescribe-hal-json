(function() {
  var getEmbedded, getPropertyValue, getRel, getSelfLink, mapEmbedded, mapEntity, mapExtraProperties, mapLinks, mapObject, mapProperties, mapToHal, propertyTypes,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  propertyTypes = {
    integer: parseInt,
    boolean: function(property) {
      if (property === 'true') {
        return true;
      } else {
        return false;
      }
    },
    float: parseFloat
  };

  mapToHal = module.exports = function(hyperdescribe) {
    return mapEntity(hyperdescribe.hyperdescribe);
  };

  mapEntity = function(entity) {
    var embedded, extra, extraProperties, newEntity, _i, _len, _ref, _ref1, _ref2, _ref3;
    if (((_ref = entity.content) != null ? _ref.properties : void 0) != null) {
      newEntity = mapProperties(entity.content.properties);
    } else {
      newEntity = {};
    }
    if (((_ref1 = entity.content) != null ? _ref1.transitions : void 0) != null) {
      newEntity._links = mapLinks(entity.content.transitions);
    }
    if (newEntity._links != null) {
      if (newEntity._links.self == null) {
        newEntity._links.self = getSelfLink(entity);
      }
    }
    if (((_ref2 = entity.content) != null ? _ref2.entities : void 0) != null) {
      embedded = getEmbedded(entity.content.entities);
      if (embedded.length > 0) {
        newEntity._embedded = mapEmbedded(embedded);
      }
      extraProperties = mapExtraProperties(entity.content.entities);
      _ref3 = Object.keys(extraProperties);
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        extra = _ref3[_i];
        newEntity[extra] = extraProperties[extra];
      }
    }
    return newEntity;
  };

  getSelfLink = function(entity) {
    return [
      {
        href: entity.url
      }
    ];
  };

  mapProperties = function(properties) {
    return properties.reduce(function(properties, property) {
      properties[property.name] = getPropertyValue(property);
      return properties;
    }, {});
  };

  mapExtraProperties = function(entities) {
    var extras;
    extras = entities.filter(function(entity) {
      return (entity.url == null) && (entity.rels == null) && (entity.property != null) && (entity.content != null);
    });
    return extras.reduce(function(extraObj, extra) {
      var extra2, extraExtra, _i, _len, _ref;
      extraObj[extra.property] = mapProperties(extra.content.properties);
      if (extra.content.entities != null) {
        extraExtra = mapExtraProperties(extra.content.entities);
        _ref = Object.keys(extraExtra);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          extra2 = _ref[_i];
          extraObj[extra.property][extra2] = extraExtra[extra2];
        }
      }
      return extraObj;
    }, {});
  };

  getPropertyValue = function(property) {
    if ((property.type != null) && property.type !== 'text') {
      return propertyTypes[property.type](property.value);
    }
    return String(property.value);
  };

  getRel = function(obj) {
    return obj.rels.join(" ");
  };

  mapObject = function(items) {
    return items.reduce(function(itemObj, item) {
      var rel;
      rel = getRel(item);
      if (__indexOf.call(itemObj, rel) < 0) {
        itemObj[rel] = [];
      }
      return itemObj;
    }, {});
  };

  mapLinks = function(transitions) {
    var links;
    links = transitions.filter(function(transition) {
      var _ref;
      return (((_ref = transition.method) != null ? _ref.valueOf() : void 0) === 'GET' || (transition.method == null)) && (transition.rels != null);
    });
    return links.reduce(function(linkObj, link) {
      var halLink, rel;
      rel = getRel(link);
      halLink = {
        href: link.url
      };
      if (link.isTemplated) {
        halLink.templated = true;
      }
      linkObj[rel].push(halLink);
      return linkObj;
    }, mapObject(links));
  };

  getEmbedded = function(entities) {
    return entities.filter(function(entity) {
      var _ref;
      return (((_ref = entity.rels) != null ? _ref.length : void 0) != null) && (entity.url != null);
    });
  };

  mapEmbedded = function(embedded) {
    return embedded.reduce(function(entityObj, entity) {
      var rel;
      rel = getRel(entity);
      entityObj[rel].push(mapEntity(entity));
      return entityObj;
    }, mapObject(embedded));
  };

}).call(this);
