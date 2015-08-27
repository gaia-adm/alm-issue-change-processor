



JS services cannot work with empty password

NOTE: cannot work with empty password
docker run -d -p 9006:8080 -e AMQ_USER="admin" -e AMQ_PASSWORD="admin" -e STORAGE_PATH="/upload" -v "/tmp:/upload" --link rabbitmq-master:amqserver --link sts:authserver --name rus gaiaadm/result-upload-service

docker run -d -e AMQ_USER="admin" -e AMQ_PASSWORD="admin" -v "/tmp:/upload" --link rabbitmq-master:amqserver --link mgs:metricsgw --name swp gaiaadm/sample-weather-processor

Sending notification manually (via RabbitMQ web console):
Exchange: result-upload
Routing Key: alm/issue/change
delivery_mode:	2
headers:
	accessToken:	e53f0aef-19ad-4ed8-99dc-705f974b2ce7
	tenantId:	1
	path:	/upload/4e516623-dfb8-48f2-9471-06e3bd23caf2/2b2d4e25-f9ec-4a09-9b5b-a1774048a5fd (actually, c:\upload\...)
payload: {"dataType":"alm/issue/change","C_ALM_LOCATION":"http://belozovs2.hpqcorp.emea.net:8080/qcbin","C_DOMAIN":"Default","C_PROJECT":"bp1","contentType":"application/xml; charset=UTF-8","mimeType":"application/xml","charset":"UTF-8"}
CONTENT OF THE FILE IN UPLOAD FOLDER:
<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Audits TotalResults="1"><Audit><Id>14</Id><Action>UPDATE</Action><ParentId>1</ParentId><ParentType>defect</ParentType><Time>2015-08-25 10:11:50</Time><User>sa</User><Properties><Property Label="Severity" Name="severity"><NewValue>3-High</NewValue><OldValue>2-Medium</OldValue></Property></Properties></Audit></Audits>

processingMetadata.path:
	/upload/4e516623-dfb8-48f2-9471-06e3bd23caf2/2b2d4e25-f9ec-4a09-9b5b-a1774048a5fd
envParams (created by getEnvParams, only relevant):
	P_CHARSET = "UTF-8"
	P_CONTENTTYPE = "application/xml; charset=UTF-8"
	P_C_ALM_LOCATION = "http://belozovs2.hpqcorp.emea.net:8080/qcbin"
	P_C_DOMAIN = "Default"
	P_C_PROJECT = "bp1"
	P_DATATYPE = "alm/issue/change"
	P_MIMETYPE = "application/xml"
processorDesc.path:
	c:\GitHub\Gaia\result-processing\processors\alm-issue-change
processorDesc.command:
	node processor.js

return childProcess.spawn(file, args, options);
