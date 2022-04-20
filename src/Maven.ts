import { execInShell } from './ShUtils'

export function validate(settings: string) {
    execInShell(`
        export JAVA_TOOL_OPTIONS=
		mvn -e -s ${settings} validate
    `)
}

export function build() {
    execInShell(`
        export JAVA_TOOL_OPTIONS=
	    mvn -e -f pom.xml -Dmaven.test.failure.ignore=true package -DjvmArgs='-Xmx4096m -Xms512m -XX:PermSize=512m -XX:MaxPermSize=4096m'
    `)
}

export function buildWithSettings(settings: string) {
    execInShell(`
        export JAVA_TOOL_OPTIONS=
		mvn -e -f pom.xml -s ${settings} compile -Pcommon,client,test -Dstyle.color=always -DjvmArgs='-Xmx4096m -Xms512m -XX:PermSize=512m -XX:MaxPermSize=4096m'
    `)
}

export function buildOffline(settings: string) {
    execInShell(`
        export JAVA_TOOL_OPTIONS=
		mvn --offline -e -f pom.xml -s ${settings} -Dstyle.color=always -DskipTests compile
    `)
}

export function runWithPath(settings: string, pathToPom: string, target: string) {
    execInShell(`
        export JAVA_TOOL_OPTIONS=
		mvn -e -f ${pathToPom} -s ${settings} -Dstyle.color=always ${target}
    `)
}

export function runWithName(settings: string, pomName: string, target: string) {
    execInShell(`
        export JAVA_TOOL_OPTIONS=
		mvn -e -f ${pomName} -s ${settings} -Dstyle.color=always ${target}
    `)
}

export function runWithMavenOpts(settings: string, target: string, profile: string, extraParamaters: string = "", mavenOpts: string = "") {
    execInShell(`
        export MAVEN_OPTS=${mavenOpts}
        export JAVA_TOOL_OPTIONS=
		mvn -e -f pom.xml -s ${settings} -Dstyle.color=always ${target} -P${profile} ${extraParamaters}
    `)
}

export function run(settings: string, target: string) {
    execInShell(`
        export JAVA_TOOL_OPTIONS=
		mvn -e -f pom.xml -s ${settings} -Dstyle.color=always ${target}
    `)
}

export function testUnit(settings: string) {
    execInShell(`
        export JAVA_TOOL_OPTIONS=
		mvn -f pom.xml -s ${settings} integration-test -Ptest -Dstyle.color=always -Dmaven.test.failure.ignore=true -Dabs.config=ata0
    `)
}

export function zip() {
    execInShell(`
        cd target/repository
        zip -rv updatesite.zip .
        cd ../..
    `)
}

export function newProject(projectName: string, groupId: string) {
    execInShell(`
        mvn -B archetype:generate -DgroupId=${groupId} -DartifactId=${projectName} -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4
    `)
}

export function multilineTest() {
    execInShell(`
        pwd
        ls
        echo multilineTest
    `)
}