import { writeFile } from "fs";
import { execInShell } from "./ShUtils"

export function downloadJar(ciClientUrl: string) {
    console.log(`download jar from ${ciClientUrl}`)
    execInShell(`wget -O ToscaCIJavaClient.jar ${ciClientUrl} --proxy=no`)
}

export function runParallel() {
    // only 1 worker per step, maybe on our own infrastracture it's possible?
}

export function runToscaTestForSpecificEntity(dexUrl: string, aoServicePort: string) {
    let testCases: any[] = [] // read from yaml file latter
    testCases.forEach(testCase => {


        createConfigFile(dexUrl, aoServicePort, testCase.toscaWorkspace)
        createTestEventXml("", testCase.toscaUniqueId) // where is this 'folderName' param?

        runToscaTestForSingleEntity(testCase.toscaUniqueId)

        let pathToJunitXml: string = testCase.toscaUniqueId + ".xml"

        // Send data to Harold
        // to be implemented
    })
}

export function runToscaTestForSingleEntity(toscaUniqueId: string) {
    execInShell(`export JAVA_TOOL_OPTIONS=
                java -jar ToscaCIJavaClient.jar -m distributed -c nodes.xml -r ${toscaUniqueId}.xml`)
}

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

