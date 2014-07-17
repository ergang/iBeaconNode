iBeaconNode
===========

GET
http://esun1.intuitlabs.com/tags
http://esun1.intuitlabs.com/tags/:tagId

POST
http://esun1.intuitlabs.com/tags

DELETE
http://esun1.intuitlabs.com/tags
http://esun1.intuitlabs.com/tags/:tagId

Model:
    {
        business: String,
        name : String,
        beacons: [{
            uuid: String,
            major: String,
            minor: String,
            distance: Number,
            rssi: Number
        }]
    }