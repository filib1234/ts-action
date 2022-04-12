import { writeFile } from "fs";


export function createConfigFile(dexUrl: string, aoServicePort: string, toscaWorkspace: string) {
    let content =
        `address=${dexUrl}/DistributionServerService/ManagerService.svc
        username=
        password=
        considerexecutionresult=false
        resulttype=junit
        pollinginterval=60000
        ciclienttimeout=36000000
        reportintermediateresults=true
        workspacelessexecution=true
        aoserviceaddress=${dexUrl}:${aoServicePort}/
        workspacerootname=${toscaWorkspace}`

    writeFile("config.properties", content, function (err) {
        if (err) {
            return console.error(err);
        }
        console.log("Tosca configuration file created");
    })
}

export function createTestEventXml(folderName: string, toscaUniqueId: string) {
    let optionalResultFolder = ""
    if (folderName) {
        optionalResultFolder = `resultfolder="${folderName}"`
    }
    let content =
        `<?xml version="1.0" encoding="utf-16" ?>
                <testConfiguration>
                    <TestEvents>
                        <TestEvent ${optionalResultFolder}>${toscaUniqueId}</TestEvent>
                    </TestEvents>
                </testConfiguration>`

    writeFile("nodes.xml", content, function (err) {
        if (err) {
            return console.error(err);
        }
        console.log("Test event configuration file created");
    })
}