import { writeContentToFile } from './Test'

export function generatePomString(releaseTests: any[], workspace: string): string {
    let count: number = 1
    let mergedExecutions: string = ''
    releaseTests.forEach(testCase => {
        let projectProperties: string
        let globalProperties: string
        let environment: string = testCase.environment
        if (environment != null && environment != undefined) {
            environment = environment.trim()
            projectProperties = `${workspace}/testcases/${testCase.pathToProjectDirectory}/${testCase.soapUiProjectName}-${environment}.properties`
            globalProperties = `${workspace}/testcases/global-${environment}.properties`
        } else {
            projectProperties = `${workspace}/testcases/${testCase.pathToProjectDirectory}/${testCase.soapUiProjectName}.properties`
            globalProperties = `${workspace}/testcases/global.properties`
        }
        mergedExecutions += `
            <execution>
            <id>testCase${count++}</id>
            <phase>test</phase>
            <goals>
            <goal>test</goal>
            </goals>
            <configuration>
            <soapuiProperties combine.children="append">
            <property>
            <name>soapui.properties.${testCase.soapUiProjectName}</name>
            <value>${projectProperties}</value>
            </property>
            <property>
            <name>soapui.properties</name>
            <value>${globalProperties}</value>
            </property>
            </soapuiProperties>
            <settingsFile>${workspace}/testcases/${testCase.pathToProjectDirectory}/${testCase.soapUiProjectName}-settings.xml</settingsFile>
            <projectFile>${workspace}/testcases/${testCase.soapUiPath}</projectFile>
            <junitReport>true</junitReport>
            <outputFolder>${workspace}/testResults/${testCase.businessArea}/${testCase.tribe}/${testCase.team}/${testCase.soapUiProjectName}</outputFolder>
            </configuration>
            </execution>
        `
    })

    return `
    <?xml version="1.0" encoding="UTF-8"?>
        <project xmlns="http://maven.apache.org/POM/4.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
            <modelVersion>4.0.0</modelVersion>
          
            <groupId>de.allianz.abs</groupId>
            <artifactId>abs-testproject</artifactId>
            <version>1.0-SNAPSHOT</version>
          
            <pluginRepositories>
                <pluginRepository>
                    <id>smartbear-sweden-plugin-repository</id>
                    <url>http://www.soapui.org/repository/maven2/</url>
                </pluginRepository>
                <pluginRepository>
                    <id>SmartBearPluginRepository</id>
                    <url>http://smartbearsoftware.com/repository/maven2</url>
                </pluginRepository>
            </pluginRepositories>
          
            <properties>
            </properties>
          
            <build>
                <plugins>
                    <plugin>
                        <groupId>com.smartbear.soapui</groupId>
                        <artifactId>soapui-maven-plugin</artifactId>
                        <version>5.5.0</version>
                        <dependencies>
                            <dependency>
                                <groupId>com.jgoodies</groupId>
                                <artifactId>forms</artifactId>
                                <version>1.2.1</version>
                            </dependency>
                            <dependency>
                                <groupId>org.reflections</groupId>
                                <artifactId>reflections</artifactId>
                                <version>0.9.9-RC1</version>
                            </dependency>
                            <dependency>
                                <groupId>org.apache.poi</groupId>
                                <artifactId>poi-ooxml</artifactId>
                                <version>3.10-FINAL</version>
                            </dependency>
                        </dependencies>
                        <configuration>
                            <testFailIgnore>true</testFailIgnore>
                        </configuration>
                        <executions>
                            ${mergedExecutions}
                        </executions>
                    </plugin>
                </plugins>
            </build>
          
            <dependencyManagement>
            </dependencyManagement>
          
            <dependencies>
            </dependencies>
          
        </project>
    `
}

export function writeSettings(testCase: any, workspace: string) {
    let preSettings = `
<?xml version="1.0" encoding="UTF-8"?>
<con:soapui-settings xmlns:con="http://eviware.com/soapui/config"><con:setting id="WsdlSettings@excluded-types">&lt;con:entry xmlns:con="http://eviware.com/soapui/config">schema@http://www.w3.org/2001/XMLSchema&lt;/con:entry></con:setting><con:setting id="WsdlSettings@name-with-binding">true</con:setting><con:setting id="HttpSettings@http_version">1.1</con:setting><con:setting id="HttpSettings@max_total_connections">2000</con:setting><con:setting id="HttpSettings@response-compression">true</con:setting><con:setting id="HttpSettings@leave_mockengine">true</con:setting><con:setting id="UISettings@auto_save_projects_on_exit">true</con:setting><con:setting id="UISettings@show_descriptions">true</con:setting><con:setting id="WsdlSettings@xml-generation-always-include-optional-elements">true</con:setting><con:setting id="WsaSettings@useDefaultRelatesTo">true</con:setting><con:setting id="WsaSettings@useDefaultRelationshipType">true</con:setting><con:setting id="UISettings@show_startup_page">true</con:setting><con:setting id="UISettings@gc_interval">60</con:setting><con:setting id="WsdlSettings@cache-wsdls">true</con:setting><con:setting id="WsdlSettings@pretty-print-response-xml">true</con:setting><con:setting id="HttpSettings@include_request_in_time_taken">true</con:setting><con:setting id="HttpSettings@include_response_in_time_taken">true</con:setting><con:setting id="HttpSettings@start_mock_service">true</con:setting><con:setting id="UISettings@auto_save_interval">0</con:setting><con:setting id="WsaSettings@soapActionOverridesWsaAction">true</con:setting><con:setting id="WsaSettings@overrideExistingHeaders">true</con:setting><con:setting id="WsaSettings@enableForOptional">true</con:setting><con:setting id="VersionUpdateSettings@auto-check-version-update">true</con:setting><con:setting id="ProxySettings@autoProxy">false</con:setting><con:setting id="ProxySettings@enableProxy">false</con:setting><con:setting id="WSISettings@location">/Applications/SoapUI-5.5.0.app/Contents/Resources/app/wsi-test-tools</con:setting><con:setting id="UISettings@native-laf">true</con:setting><con:setting id="UISettings@show_stay_tuned">false</con:setting><con:setting id="RecentAssertionSettings@recent-assertions"><![CDATA[<xml-fragment><con:entry xmlns:con="http://eviware.com/soapui/config">Contains</con:entry><con:entry xmlns:con="http://eviware.com/soapui/config">Not Contains</con:entry><con:entry xmlns:con="http://eviware.com/soapui/config">Sensitive Information Exposure</con:entry><con:entry xmlns:con="http://eviware.com/soapui/config">Valid HTTP Status Codes</con:entry></xml-fragment>]]></con:setting><con:setting id="AssertionDescriptionSettings@show-assertion-description">false</con:setting><con:setting id="GlobalPropertySettings@properties">&lt;xml-fragment/></con:setting><con:setting id="GlobalPropertySettings@security_scans_properties"><![CDATA[<xml-fragment xmlns:con="http://eviware.com/soapui/config">
  <con:property>
    <con:name>~(?s).*(s|S)tack ?(t|T)race.*</con:name>
    <con:value>[Stacktrace] Can give hackers information about which software or language you are using</con:value>
  </con:property>
  <con:property>
    <con:name>~(?s).*STACK\s?TRACE.*</con:name>
    <con:value>[Stacktrace] Can give hackers information about which software or language you are using</con:value>
  </con:property>
  <con:property>
    <con:name>~(?s).*(s|S)tack:.*</con:name>
    <con:value>[Stacktrace] Can give hackers information about which software or language you are using</con:value>
  </con:property>
  <con:property>
    <con:name>~(?s).*(s|S)yntax (e|E)rror\s.*</con:name>
    <con:value>[Stacktrace] Can give hackers information about which software or language you are using</con:value>
  </con:property>
  <con:property>
    <con:name>~(?s).*((I|i)ncorrect|(I|i)nvalid) (s|S)yntax.*</con:name>
    <con:value>[Stacktrace] Can give hackers information about which software or language you are using</con:value>
  </con:property>
  <con:property>
    <con:name>~(?s).*Runtime (E|e)rror.*</con:name>
    <con:value>[Stacktrace] Can give hackers information about which software or language you are using</con:value>
  </con:property>
  <con:property>
    <con:name>~(?s).*Error in process &lt;\d+\.\d+\.\d+> with exit value:.*</con:name>
    <con:value>[Stacktrace] Can give hackers information about which software or language you are using</con:value>
  </con:property>
  <con:property>
    <con:name>~(?s).*at [a-zA-Z][\w\$]*(\.[a-zA-Z][\w\$]*)+\((Unknown Source|Native
            Method|[a-zA-Z][\w\$]*\.([a-zA-Z]{3,5}):\d+)\)
        .*</con:name>
    <con:value>[Stacktrace] Can give hackers information about which software or language you are using</con:value>
  </con:property>
  <con:property>
    <con:name>~(?s).*&lt;\w+:frame\s*class=".*"\s*line=".*"\s*method=".*"\s*/>.*</con:name>
    <con:value>[Stacktrace] Can give hackers information about which software or language you are using</con:value>
  </con:property>
  <con:property>
    <con:name>~(?s).*[^\s]+\.rb:\d+:in \`.+'.*</con:name>
    <con:value>[Stacktrace] Can give hackers information about which software or language you are using</con:value>
  </con:property>
  <con:property>
    <con:name>~(?s).*at [\w\$]+(\.[\w\$&lt;>\[\],]+|\.\.ctor)+(\((([\w\$&lt;>\`\[\]]+ [\w\$&lt;>]+, )*(([\w\$&lt;>\`\[\]]+
            [\w\$&lt;>]+)))\)|\(\))
        .*</con:name>
    <con:value>[Stacktrace] Can give hackers information about which software or language you are using</con:value>
  </con:property>
  <con:property>
    <con:name>~(?s).*from [\w\$]+(\.[\w\$&lt;>]+)+:\d+:in \`.+'.*</con:name>
    <con:value>[Stacktrace] Can give hackers information about which software or language you are using</con:value>
  </con:property>
  <con:property>
    <con:name>~(?s).*Warning: [\w]+\(\) .+ in .+ on line \d{1,6}.*</con:name>
    <con:value>[Stacktrace] Can give hackers information about which software or language you are using</con:value>
  </con:property>
  <con:property>
    <con:name>~(?s).*Traceback \(most recent call last\):.*</con:name>
    <con:value>[Stacktrace] Can give hackers information about which software or language you are using</con:value>
  </con:property>
  <con:property>
    <con:name>~(?s).*File ".+", line [0-9]{1,6}, in.*</con:name>
    <con:value>[Stacktrace] Can give hackers information about which software or language you are using</con:value>
  </con:property>
  <con:property>
    <con:name>~(?s).*(v|V)ersion:? \d\.\d{1,2}\.{1,3}-?.*</con:name>
    <con:value>[Version x.y.z] Exposing version numbers gives
            unnecessary hints on your systems vulnerabilities</con:value>
  </con:property>
  <con:property>
    <con:name>~(?s).*(p|P)owered by:? ([a-zA-Z]+)( [a-zA-Z]+){0,3}( |/)\d\.\d{1,2}\.\d{1,3}.*</con:name>
    <con:value>[Version x.y.z] Exposing version numbers gives
            unnecessary hints on your systems vulnerabilities</con:value>
  </con:property>
  <con:property>
    <con:name>~(?s).*((A|a)pache|vBulletin|MySQL|PostgreSQL|phpBB|Internet Information Services)( |/)\d{1,2}(\.\d{1,3})+
        .*</con:name>
    <con:value>[Version x.y.z] Exposing version numbers gives
            unnecessary hints on your systems vulnerabilities</con:value>
  </con:property>
  <con:property>
    <con:name>~(?s).*\w+/\d{1,2}(\.\d{1,3})+.*</con:name>
    <con:value>[Version x.y.z] Exposing version numbers gives
            unnecessary hints on your systems vulnerabilities</con:value>
  </con:property>
  <con:property>
    <con:name>~(?s).*SQLSTATE: [A-Z0-9].*</con:name>
    <con:value>[Database error messages] Internal database information can be misused by hackers</con:value>
  </con:property>
  <con:property>
    <con:name>~(?s).*Invalid column name\s.*</con:name>
    <con:value>[Database error messages] Internal database information can be misused by hackers</con:value>
  </con:property>
  <con:property>
    <con:name>~(?s).*(e|E)rror was:\s.*</con:name>
    <con:value>[Database error messages] Internal database information can be misused by hackers</con:value>
  </con:property>
  <con:property>
    <con:name>~(?s).*
            (ORA|EXP|IMP|KUP|UDE|UDI|DBV|LCD|QSM|OCI|RMAN|LFI|PLS|PLQ|AMD|CLSR|PROC|PROT|TNS|NNC|NLP|NNF|NMP|NCR|NZE|O2F|O2I|O2U|PCB|PCC|SQL|AUD|IMG|VID|DRG|LPX|LSX)-\d{5}\s
        .*</con:name>
    <con:value>[Database error messages] Internal database information can be misused by hackers</con:value>
  </con:property>
`
    let settingsLine = ''
    if (testCase.soapUiKeystore != null && testCase.soapUiKeystore != undefined) {
        settingsLine = `</xml-fragment>]]></con:setting><con:setting id=\"HttpSettings@user-agent\"/><con:setting id=\"HttpSettings@request-compression\">None</con:setting><con:setting id=\"HttpSettings@disable_response_decompression\">false</con:setting><con:setting id=\"HttpSettings@close-connections\">false</con:setting><con:setting id=\"HttpSettings@chunking_threshold\"/><con:setting id=\"HttpSettings@authenticate-preemptively\">false</con:setting><con:setting id=\"HttpSettings@expect-continue\">false</con:setting><con:setting id=\"HttpSettings@encoded_urls\">false</con:setting><con:setting id=\"HttpSettings@forward_slashes\">false</con:setting><con:setting id=\"HttpSettings@bind_address\"/><con:setting id=\"HttpSettings@socket_timeout\"/><con:setting id=\"HttpSettings@max_response_size\"/><con:setting id=\"HttpSettings@max_connections_per_host\"/><con:setting id=\"HttpSettings@enable_mock_wire_log\">false</con:setting><con:setting id=\"ProxySettings@host\">de001-surf.zone2.proxy.allianz</con:setting><con:setting id=\"ProxySettings@port\">8080</con:setting><con:setting id=\"ProxySettings@username\"/><con:setting id=\"ProxySettings@password\"/><con:setting id=\"ProxySettings@excludes\"/><con:setting id=\"SSLSettings@keyStore\">${workspace}/certificates/${testCase.soapUiKeystore}</con:setting><con:setting id=\"SSLSettings@keyStorePassword\">changeit</con:setting><con:setting id=\"SSLSettings@enableMockSSL\">false</con:setting><con:setting id=\"SSLSettings@mockPort\"/><con:setting id=\"SSLSettings@mockKeyStore\"/><con:setting id=\"SSLSettings@mockPassword\"/><con:setting id=\"SSLSettings@mockKeyStorePassword\"/><con:setting id=\"SSLSettings@mockTrustStore\"/><con:setting id=\"SSLSettings@mockTrustStorePassword\"/><con:setting id=\"SSLSettings@needClientAuthentication\">true</con:setting><con:setting id=\"WsdlSettings@xml-generation-type-example-value\">false</con:setting><con:setting id=\"WsdlSettings@xml-generation-type-comment-type\">false</con:setting><con:setting id=\"WsdlSettings@attachment-parts\">false</con:setting><con:setting id=\"WsdlSettings@allow-incorrect-contenttype\">false</con:setting><con:setting id=\"WsdlSettings@schema-directory\"/><con:setting id=\"WsdlSettings@strict-schema-types\">false</con:setting><con:setting id=\"WsdlSettings@compression-limit\"/><con:setting id=\"WsdlSettings@pretty-print-project-files\">false</con:setting><con:setting id=\"WsdlSettings@trim-wsdl\">false</con:setting><con:setting id=\"UISettings@close-projects\">false</con:setting><con:setting id=\"UISettings@order-projects\">false</con:setting><con:setting id=\"UISettings@order-services\">false</con:setting><con:setting id=\"UISettings@order-requests\">false</con:setting><con:setting id=\"UISettings@create_backup\">false</con:setting><con:setting id=\"UISettings@backup_folder\"/><con:setting id=\"UISettings@normalize_line-breaks\">false</con:setting><con:setting id=\"UISettings@desktop-type\">Default</con:setting><con:setting id=\"UISettings@mru_panel_selector\">false</con:setting><con:setting id=\"UISettings@dont-disable-groovy-log\">false</con:setting><con:setting id=\"UISettings@show_logs_at_startup\">false</con:setting><con:setting id=\"UISettings@disable_tooltips\">false</con:setting><con:setting id=\"UISettings@raw_response_message_size_show\">10000</con:setting><con:setting id=\"UISettings@raw_request_message_size_show\">10000</con:setting><con:setting id=\"UISettings@wrap_raw_messages\">false</con:setting><con:setting id=\"UISettings@disable_analytics\">false</con:setting><con:setting id=\"UISettings@editor-font\">Courier 11</con:setting><con:setting id=\"UISettings@no_resize_request_editor\">false</con:setting><con:setting id=\"UISettings@start_with_request_tabs\">false</con:setting><con:setting id=\"UISettings@auto_validate_request\">false</con:setting><con:setting id=\"UISettings@abort_on_invalid_request\">false</con:setting><con:setting id=\"UISettings@auto_validate_response\">false</con:setting><con:setting id=\"UISettings@show_xml_line_numbers\">false</con:setting><con:setting id=\"UISettings@show_groovy_line_numbers\">false</con:setting><con:setting id=\"ToolsSettings@jbossws_wstools\"/><con:setting id=\"ToolsSettings@axis_1_X\"/><con:setting id=\"ToolsSettings@axis_2\"/><con:setting id=\"ToolsSettings@jwsdp_wscompile\"/><con:setting id=\"ToolsSettings@jwsdp_wsimport\"/><con:setting id=\"ToolsSettings@javac\"/><con:setting id=\"ToolsSettings@dotnet_wsdl\"/><con:setting id=\"ToolsSettings@cxf\"/><con:setting id=\"ToolsSettings@xfire\"/><con:setting id=\"ToolsSettings@gsoap\"/><con:setting id=\"ToolsSettings@ant\"/><con:setting id=\"ToolsSettings@xmlbeans\"/><con:setting id=\"ToolsSettings@jaxb\"/><con:setting id=\"ToolsSettings@tcpmon\"/><con:setting id=\"ToolsSettings@wsa\"/><con:setting id=\"ToolsSettings@wadl2java\"/><con:setting id=\"ToolsSettings@hermesjms\"/><con:setting id=\"WSISettings@verbose\">false</con:setting><con:setting id=\"WSISettings@profile_type\">BasicSecurityProfile-1.0-TAD.xml</con:setting><con:setting id=\"WSISettings@correlation_type\">endpoint</con:setting><con:setting id=\"WSISettings@messageEntry\">false</con:setting><con:setting id=\"WSISettings@failureMessage\">false</con:setting><con:setting id=\"WSISettings@assertionDescription\">false</con:setting><con:setting id=\"WSISettings@showLog\">false</con:setting><con:setting id=\"WSISettings@outputFolder\"/><con:setting id=\"GlobalPropertySettings@enableOverride\">false</con:setting><con:setting id=\"SecuritySettings@shadowProxyPassword\"/><con:setting id=\"UxmSettings@status-refresh-frequency\">5</con:setting><con:setting id=\"NextAU\">1595599913403</con:setting></con:soapui-settings>`
    } else {
        settingsLine = `</xml-fragment>]]></con:setting><con:setting id=\"HttpSettings@user-agent\"/><con:setting id=\"HttpSettings@request-compression\">None</con:setting><con:setting id=\"HttpSettings@disable_response_decompression\">false</con:setting><con:setting id=\"HttpSettings@close-connections\">false</con:setting><con:setting id=\"HttpSettings@chunking_threshold\"/><con:setting id=\"HttpSettings@authenticate-preemptively\">false</con:setting><con:setting id=\"HttpSettings@expect-continue\">false</con:setting><con:setting id=\"HttpSettings@encoded_urls\">false</con:setting><con:setting id=\"HttpSettings@forward_slashes\">false</con:setting><con:setting id=\"HttpSettings@bind_address\"/><con:setting id=\"HttpSettings@socket_timeout\"/><con:setting id=\"HttpSettings@max_response_size\"/><con:setting id=\"HttpSettings@max_connections_per_host\"/><con:setting id=\"HttpSettings@enable_mock_wire_log\">false</con:setting><con:setting id=\"ProxySettings@host\">de001-surf.zone2.proxy.allianz</con:setting><con:setting id=\"ProxySettings@port\">8080</con:setting><con:setting id=\"ProxySettings@username\"/><con:setting id=\"ProxySettings@password\"/><con:setting id=\"ProxySettings@excludes\"/><con:setting id=\"SSLSettings@keyStore\"/><con:setting id=\"SSLSettings@keyStorePassword\"/><con:setting id=\"SSLSettings@enableMockSSL\">false</con:setting><con:setting id=\"SSLSettings@mockPort\"/><con:setting id=\"SSLSettings@mockKeyStore\"/><con:setting id=\"SSLSettings@mockPassword\"/><con:setting id=\"SSLSettings@mockKeyStorePassword\"/><con:setting id=\"SSLSettings@mockTrustStore\"/><con:setting id=\"SSLSettings@mockTrustStorePassword\"/><con:setting id=\"SSLSettings@needClientAuthentication\">false</con:setting><con:setting id=\"WsdlSettings@xml-generation-type-example-value\">false</con:setting><con:setting id=\"WsdlSettings@xml-generation-type-comment-type\">false</con:setting><con:setting id=\"WsdlSettings@attachment-parts\">false</con:setting><con:setting id=\"WsdlSettings@allow-incorrect-contenttype\">false</con:setting><con:setting id=\"WsdlSettings@schema-directory\"/><con:setting id=\"WsdlSettings@strict-schema-types\">false</con:setting><con:setting id=\"WsdlSettings@compression-limit\"/><con:setting id=\"WsdlSettings@pretty-print-project-files\">false</con:setting><con:setting id=\"WsdlSettings@trim-wsdl\">false</con:setting><con:setting id=\"UISettings@close-projects\">false</con:setting><con:setting id=\"UISettings@order-projects\">false</con:setting><con:setting id=\"UISettings@order-services\">false</con:setting><con:setting id=\"UISettings@order-requests\">false</con:setting><con:setting id=\"UISettings@create_backup\">false</con:setting><con:setting id=\"UISettings@backup_folder\"/><con:setting id=\"UISettings@normalize_line-breaks\">false</con:setting><con:setting id=\"UISettings@desktop-type\">Default</con:setting><con:setting id=\"UISettings@mru_panel_selector\">false</con:setting><con:setting id=\"UISettings@dont-disable-groovy-log\">false</con:setting><con:setting id=\"UISettings@show_logs_at_startup\">false</con:setting><con:setting id=\"UISettings@disable_tooltips\">false</con:setting><con:setting id=\"UISettings@raw_response_message_size_show\">10000</con:setting><con:setting id=\"UISettings@raw_request_message_size_show\">10000</con:setting><con:setting id=\"UISettings@wrap_raw_messages\">false</con:setting><con:setting id=\"UISettings@disable_analytics\">false</con:setting><con:setting id=\"UISettings@editor-font\">Courier 11</con:setting><con:setting id=\"UISettings@no_resize_request_editor\">false</con:setting><con:setting id=\"UISettings@start_with_request_tabs\">false</con:setting><con:setting id=\"UISettings@auto_validate_request\">false</con:setting><con:setting id=\"UISettings@abort_on_invalid_request\">false</con:setting><con:setting id=\"UISettings@auto_validate_response\">false</con:setting><con:setting id=\"UISettings@show_xml_line_numbers\">false</con:setting><con:setting id=\"UISettings@show_groovy_line_numbers\">false</con:setting><con:setting id=\"ToolsSettings@jbossws_wstools\"/><con:setting id=\"ToolsSettings@axis_1_X\"/><con:setting id=\"ToolsSettings@axis_2\"/><con:setting id=\"ToolsSettings@jwsdp_wscompile\"/><con:setting id=\"ToolsSettings@jwsdp_wsimport\"/><con:setting id=\"ToolsSettings@javac\"/><con:setting id=\"ToolsSettings@dotnet_wsdl\"/><con:setting id=\"ToolsSettings@cxf\"/><con:setting id=\"ToolsSettings@xfire\"/><con:setting id=\"ToolsSettings@gsoap\"/><con:setting id=\"ToolsSettings@ant\"/><con:setting id=\"ToolsSettings@xmlbeans\"/><con:setting id=\"ToolsSettings@jaxb\"/><con:setting id=\"ToolsSettings@tcpmon\"/><con:setting id=\"ToolsSettings@wsa\"/><con:setting id=\"ToolsSettings@wadl2java\"/><con:setting id=\"ToolsSettings@hermesjms\"/><con:setting id=\"WSISettings@verbose\">false</con:setting><con:setting id=\"WSISettings@profile_type\">BasicSecurityProfile-1.0-TAD.xml</con:setting><con:setting id=\"WSISettings@correlation_type\">endpoint</con:setting><con:setting id=\"WSISettings@messageEntry\">false</con:setting><con:setting id=\"WSISettings@failureMessage\">false</con:setting><con:setting id=\"WSISettings@assertionDescription\">false</con:setting><con:setting id=\"WSISettings@showLog\">false</con:setting><con:setting id=\"WSISettings@outputFolder\"/><con:setting id=\"GlobalPropertySettings@enableOverride\">false</con:setting><con:setting id=\"SecuritySettings@shadowProxyPassword\"/><con:setting id=\"UxmSettings@status-refresh-frequency\">5</con:setting><con:setting id=\"NextAU\">1595599913403</con:setting></con:soapui-settings>`
    }
    let settings: string = preSettings + settingsLine

    writeContentToFile(settings, `${workspace}/testcases/${testCase.pathToProjectDirectory}/${testCase.soapUiProjectName}-settings.xml`)
}