import { writeFile } from "fs";
import { exec } from "child_process"

// loadPluginJar
// check ts -> shell execution
// link as parameter?
export function testShell() {
    exec("pwd", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    })
    exec("ls", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    })
}

// runParallel -> read about actions infrastucture? can we run parallel jobs?
// where to download? 
// link as parameter?


// runToscaTestForSpecificEntity
// runToscaDExForSingleEntry

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

