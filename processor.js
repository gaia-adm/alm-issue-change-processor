'use strict';

var xml2js = require("xml2js");
var parser = xml2js.parseString;

var params = getProcessParameters();

exitOnSignal('SIGTERM');

if (Object.keys(params).length > 0) {
    // custom metadata keys are prefixed with C_
    console.error('LOCATION: ' + params.C_ALM_LOCATION);
    console.error('DOMAIN: ' + params.C_DOMAIN);
    console.error('PROJECT: ' + params.C_PROJECT);
} else {
    console.log('[]');
    process.exit(0);
}

readInputStream(parseXml);

function parseXml (data){
    console.error('Start parsing alm-issue-change XML');
    parser(data, function(err, result){

        var issue_change = [];
        var elements = result.Audits.Audit.length;
        for(var i = 0; i< elements; i++) {
            var auditEvent = {};
            auditEvent.event = "issue_change";
            //TODO - boris: parse to  ISO 8601, what TZ we receive from ALM?
            auditEvent.time = new Date(result.Audits.Audit[i].Time[0]).toISOString();
            //set ID section
            var id = {};
            id.uid =  result.Audits.Audit[i].ParentId[0];
            id.auditId = result.Audits.Audit[i].Id[0];
            auditEvent.id = id;
            //set tags, which are not from metadata
            var tags = {};
            tags.User = result.Audits.Audit[i].User[0];
            tags.Action = result.Audits.Audit[i].Action[0];
            auditEvent.tags = tags;
            var source = {};
            source.Location = params.C_ALM_LOCATION;
            source.Domain = params.C_DOMAIN;
            source.Project = params.C_PROJECT;
            auditEvent.source = source;
            var fi = [];
            for(var j = 0; j < result.Audits.Audit[i].Properties.length ; j++){
                fi.push(createFieldFromProperty(result.Audits.Audit[i].Properties[j]));
            }
            auditEvent.fields = fi[0];

            issue_change.push(auditEvent);
        }
        console.error('ALM issue change payload to be sent to metrics-gateway-service: ' + JSON.stringify(issue_change));
        //use process stdout via console.log to send the result to result-processing (parent process)
        console.log(JSON.stringify(issue_change));
        process.exit(0);
    });
}

//TODO - boris: use Object.keys to enumerate attributes. Problem: prop['Property'][0].$.Label works, prop['Property'][0].$.keys[0] does not work
function createFieldFromProperty(prop){
    var fields = [];

    for(var p = 0; p < prop.Property.length; p++){
        var field = {};

        field.label = setIfNotEmpty(prop.Property[p].$.Label);
        field.name = setIfNotEmpty(prop.Property[p].$.Name);
        field.from = setIfNotEmpty(prop.Property[p].OldValue[0]);
        field.to = setIfNotEmpty(prop.Property[p].NewValue[0]);
        fields.push(field);
    }
    return fields;
}

function setIfNotEmpty(val) {
    if(val) {
        return val;
    }
}

function exitOnSignal(signal) {
    process.on(signal, function() {
        console.error('Caught ' + signal + ', exiting');
        process.exit(1);
    });
}

function getProcessParameters() {
    var params = {};
    var keys = Object.keys(process.env);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.lastIndexOf('P_', 0) === 0) {
            var value = process.env[key];
            params[key.substr(2)] = value;
        }
    }
    return params;
}

function readInputStream(callback) {
    console.error('Input stream received, start reading');
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', function () {
        var chunk = process.stdin.read();
        if (chunk !== null) {
            console.error('XML created from the input stream: ' + chunk);
            callback(chunk);
        }
    });
}
