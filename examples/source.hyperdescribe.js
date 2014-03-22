hd = module.exports = {
  "hyperdescribe": {
    "version": "0.1.1",
    "prefixes": [
      {
        "name":"ea",
        "href":"http://example.com/docs/rels/"
      }
    ],
    "content": {
      "transitions":[
        {
          "rels": ["self"],
          "url": "/orders",
        },
        {
          "rels":["next"],
          "url":"/orders?page=2"
        },
        {
          "rels":["ea:admin"],
          "url":"/admins/2",
          "label": "Fred"
        },
        {
          "rels":["ea:admin"],
          "url":"/admins/5",
          "label": "Kate"
        },
        {
          "rels": ["ea:find"],
          "url": "/orders{?id}",
          "isTemplated": true
        }
      ],
      "properties": [
        { "name": "currentlyProcessing", "type": "integer", "value": "14" },
        { "name": "shippedToday", "type": "integer", "value": "20" }
      ],
      "entities": [
        {
          "property": "test",
          "content": {
            "properties": [
              { "name": "a", "value": "hello" },
              { "name": "b", "value": "world" }
            ],
            "entities": [
              {
                "property": "test2",
                "content": {
                  "properties": [
                    { "name": "a", "type": "integer", "value": "1" },
                    { "name": "b", "type": "integer", "value": "2" },
                    { "name": "c", "type": "integer", "value": "3" },
                  ]
                }
              }
            ]
          }
        },
        {
          "rels": ["ea:order"],
          "url": "/orders/123",
          "content": {
            "properties": [
              { "name": "total", "type": "float", "value": 30.00 },
              { "name": "currency", "value": "USD" },
              { "name": "status", "value": "shipped" }
            ],
            "transitions": [
              {
                "rels":["ea:basket"],
                "url":"/baskets/98712"
              },
              {
                "rels":["ea:customer"],
                "url":"/customers/7809"
              }
            ]
          }
        },
        {
          "rels": ["ea:order"],
          "url": "/orders/124",
          "content": {
            "properties": [
              { "name": "total", "type": "float", "value": "20.00" },
              { "name": "currency", "value": "USD" },
              { "name": "status", "value": "processing" }
            ],
            "transitions": [
              {
                "rels":["ea:basket"],
                "url":"/baskets/97213"
              },
              {
                "rels":["ea:customer"],
                "url":"/customers/12369"
              }
            ]
          }
        }
      ]
    }
  }
}