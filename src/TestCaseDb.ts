import { release } from 'os'
import { execInShell } from './ShUtils'

const SQLTOYAML_PATH = "tools"
const SQLTOYAML_FILENAME = "sqltoyaml.jar"

export function createYamlWithEnvironmentParam(priorities: string, testTypeId: string, testLevelId: string, applicationId: string, testEnvironment: string, sqlConverterUrl: string, rootElement: string, pathToYaml: string, yamlName: string, dbConnection: string, dbUser: string, dbPasswd: string) {
    let query: string = createQueryWithTestEnvironment(priorities, testTypeId, testLevelId, applicationId, testEnvironment)
    createYAMLFromQueryWithRootElement(sqlConverterUrl, query, rootElement, pathToYaml, yamlName, dbConnection, dbUser, dbPasswd)
}

export function createYamlWithReleaseParam(priorities: string, testTypeId: string, testLevelId: string, applicationId: string, release: string, queryRelease: string, sqlConverterUrl: string, rootElement: string, pathToYaml: string, yamlName: string, dbConnection: string, dbUser: string, dbPasswd: string) {
    let query: string = createQueryWithRelease(priorities, testTypeId, testLevelId, applicationId, release, queryRelease)
    createYAMLFromQueryWithRootElement(sqlConverterUrl, query, rootElement, pathToYaml, yamlName, dbConnection, dbUser, dbPasswd)
}


export function getDayOfWeekFilter(): string {
    let dayOfWeek = new Date().getDay()
    let dayOfWeekFilter = "_______"
    switch (dayOfWeek) {
        case (0): dayOfWeekFilter = ("1______"); break;
        case (1): dayOfWeekFilter = ("_1_____"); break;
        case (2): dayOfWeekFilter = ("__1____"); break;
        case (3): dayOfWeekFilter = ("___1___"); break;
        case (4): dayOfWeekFilter = ("____1__"); break;
        case (5): dayOfWeekFilter = ("_____1_"); break;
        case (6): dayOfWeekFilter = ("______1"); break;
    }
    return dayOfWeekFilter
}

export function createPrioSQLfilter(priorities: string): string {
    let prioFilter = ""

    if (priorities != null && priorities != undefined) {
        console.log(`adding prio filter to SQL query: PRIO= ${priorities}`)
        let priorityArray: string[] = priorities.split('-')
        for (let priority in priorityArray) {
            console.log(`Adding prio = ${priority}`)
            if (prioFilter == "") {
                prioFilter = `and tt.teta_prio = '${priority}'`
            } else {
                prioFilter += ` or tt.teta_prio = '${priority}'`
            }
        }

    } else {
        console.log(`no priority-filters found in job-config - continue without PRIO-filters`)
    }
    console.log(`Prio-Filter = ${prioFilter}`)
    return prioFilter
}

export function createQueryWithRelease(priorities: string, testTypeId: string, testLevelId: string, applicationId: string, release: string, queryRelease: string): string {
    let dayOfWeekFilter: string = getDayOfWeekFilter()
    let prioFilters: string = createPrioSQLfilter(priorities)
    return `SELECT 
            teo.teob_id as test_object_id, 
            oba.orba_name as business_area, 
            otr.ortr_name as tribe, 
            ote.orte_name as team, 
            ote.orte_email as team_email, 
            teo.teob_soapui_path as soapui_path, 
            teo.teob_tosca_uniqueid as tosca_unique_id,
            teo.teob_tosca_ws as tosca_workspace,
            teo.teob_jira_id as jira_id,
            teo.teob_name as test_object_name,
            tt.teta_tosca_result_folder as tosca_result_folder,
            teo.teob_unit_suite_path as junit_suite,
            rf.apre_name as release_from,
            rt.apre_name as release_to, 
            tt.teta_valid_from as valid_from,
            tt.teta_valid_to as valid_to, 
            tt.teta_valid_weekdays as valid_weekday, 
            tl.tele_name as teststufe,
            tt.teta_prio as prio,
            ah.aphe_name as application,
            tu.teut_name as testutil,
            teo.teob_soapui_keystore as soapui_keystore,
            '${release}' as release,
            ae.apen_name as environment
            
            FROM sef_data.test_task tt
            JOIN sef_data.test_object teo ON tt.teta_teob_id = teo.teob_id
            LEFT JOIN sef_data.application_release rt ON rt.apre_id = tt.teta_apre_to_id
            LEFT JOIN sef_data.application_release rf ON rf.apre_id = tt.teta_apre_from_id 
            JOIN sef_data.organisation_team ote ON ote.orte_id = teo.teob_orte_id
            JOIN sef_data.organisation_tribe otr ON otr.ortr_id = ote.orte_ortr_id
            JOIN sef_data.organisation_business_area oba ON oba.orba_id = otr.ortr_orba_id
            JOIN sef_data.test_level tl ON tt.teta_tele_id = tl.tele_id
            JOIN sef_data.application_head ah ON teo.teob_aphe_id = ah.aphe_id
            JOIN sef_data.test_util tu ON teo.teob_teut_id = tu.teut_id
            JOIN sef_data.application_environment ae ON ae.apen_tele_id = tl.tele_id
            JOIN sef_data.application_release ar ON ae.apen_apre_id = ar.apre_id
            
            WHERE teo.teob_teut_id = ${testTypeId} 
            and tt.teta_tele_id = ${testLevelId}
            and ah.aphe_id = ${applicationId}
            and ar.apre_name = '${queryRelease}'
            and ( coalesce( tt.teta_zu_loschen, 'false' ) != 'true' or coalesce( teo.teob_zu_loschen, 'false' ) != 'true')        
            ${prioFilters}
            and current_date >= coalesce(tt.teta_valid_from,date '1970-01-01')
            and current_date<= coalesce(tt.teta_valid_to,date '9999-12-31')
            and rf.apre_order <= (select apre_order from sef_data.application_release i where apre_id = ar.apre_id)
            and rt.apre_order >= (select apre_order from sef_data.application_release i where apre_id = ar.apre_id)
            and tt.teta_valid_weekdays like '${dayOfWeekFilter}'

            ORDER BY tt.teta_prio ASC;
    `
}

export function createQueryWithTestEnvironment(priorities: string, testTypeId: string, testLevelId: string, applicationId: string, testEnvironment: string): string {
    let dayOfWeekFilter = getDayOfWeekFilter()
    let prioFilters: string = createPrioSQLfilter(priorities)

    return `SELECT
            teo.teob_id as test_object_id,
            oba.orba_name as business_area,
            otr.ortr_name as tribe,
            ote.orte_name as team,
            ote.orte_email as team_email,
            teo.teob_soapui_path as soapui_path,
            teo.teob_tosca_uniqueid as tosca_unique_id,
            teo.teob_tosca_ws as tosca_workspace,
            teo.teob_jira_id as jira_id,
            teo.teob_name as test_object_name,
            tt.teta_tosca_result_folder as tosca_result_folder,
            teo.teob_unit_suite_path as junit_suite,
            rf.apre_name as release_from,
            rt.apre_name as release_to,
            tt.teta_valid_from as valid_from,
            tt.teta_valid_to as valid_to,
            tt.teta_valid_weekdays as valid_weekday,
            tl.tele_name as teststufe,
            tt.teta_prio as prio,
            ah.aphe_name as application,
            tu.teut_name as testutil,
            teo.teob_soapui_keystore as soapui_keystore,
            ar.apre_name as release,
            ae.apen_name as environment
            
            FROM sef_data.test_task tt
            JOIN sef_data.test_object teo ON tt.teta_teob_id = teo.teob_id
            LEFT JOIN sef_data.application_release rt ON rt.apre_id = tt.teta_apre_to_id
            LEFT JOIN sef_data.application_release rf ON rf.apre_id = tt.teta_apre_from_id
            JOIN sef_data.organisation_team ote ON ote.orte_id = teo.teob_orte_id
            JOIN sef_data.organisation_tribe otr ON otr.ortr_id = ote.orte_ortr_id
            JOIN sef_data.organisation_business_area oba ON oba.orba_id = otr.ortr_orba_id
            JOIN sef_data.test_level tl ON tt.teta_tele_id = tl.tele_id
            JOIN sef_data.application_head ah ON teo.teob_aphe_id = ah.aphe_id
            JOIN sef_data.test_util tu ON teo.teob_teut_id = tu.teut_id
            JOIN sef_data.application_environment ae ON ae.apen_tele_id = tl.tele_id
            JOIN sef_data.application_release ar ON ae.apen_apre_id = ar.apre_id
            
            WHERE teo.teob_teut_id = ${testTypeId} 
            and tt.teta_tele_id = ${testLevelId}
            and ah.aphe_id = ${applicationId}
            and ae.apen_name = '${testEnvironment}'
            and (tt.teta_zu_loschen != 'true' or teo.teob_zu_loschen != 'true')
            ${prioFilters}
            and current_date >= coalesce(tt.teta_valid_from,date '1970-01-01')
            and current_date<= coalesce(tt.teta_valid_to,date '9999-12-31')
            and rf.apre_order <= (select apre_order from sef_data.application_release i where apre_id = ar.apre_id)
            and rt.apre_order >= (select apre_order from sef_data.application_release i where apre_id = ar.apre_id)
            and tt.teta_valid_weekdays like '${dayOfWeekFilter}'

            ORDER BY tt.teta_prio ASC;
    `
}

export function createYAMLFromDefault(sqlConverterUrl: string, rootElement: string, pathToYaml: string, yamlName: string, dbConnection: string, dbUser: string, dbPasswd: string) {
    createYAMLFromQueryWithRootElement(sqlConverterUrl, "", rootElement, pathToYaml, yamlName, dbConnection, dbUser, dbPasswd)
}

export function downloadSqlToYaml(sqlConverterUrl: string) {
    execInShell(`wget -O ${SQLTOYAML_FILENAME} ${sqlConverterUrl} --proxy=no`)
}

export function createYAMLFromQuery(sqlConverterUrl: string, query: string, pathToYaml: string, yamlName: string, dbConnection: string, dbUser: string, dbPasswd: string) {
    downloadSqlToYaml(sqlConverterUrl)
    execInShell(`java -jar ${SQLTOYAML_PATH}/${SQLTOYAML_FILENAME} "${query}" "${pathToYaml}/" "${yamlName}" "${dbConnection}" "${dbUser}" "${dbPasswd}"`)
}

export function createYAMLFromQueryWithRootElement(sqlConverterUrl: string, query: string, rootElement: string, pathToYaml: string, yamlName: string, dbConnection: string, dbUser: string, dbPasswd: string) {
    downloadSqlToYaml(sqlConverterUrl)
    execInShell(`java -jar ${SQLTOYAML_PATH}/${SQLTOYAML_FILENAME} "${query}" "${rootElement}" "${pathToYaml}/" "${yamlName}" "${dbConnection}" "${dbUser}" "${dbPasswd}"`)
}