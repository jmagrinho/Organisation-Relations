export type Organisation = {
    Id: number,
    Name: string
}

export type OrganisationRelation = {
    IDOrganisationA: number,
    IDOrganisationB: number,
    Type: number
}

export type RelationType = {
    Id: number,
    Name: string
}


export type OrganisationRelationsList = {
    org_name: string,
    relationship_type: string
}

export type showRelationsJSON = {
    status_code: number,
    status_message: string,
    results: object,
    results_count: number,
    next_page: string,
    prev_page: string
}

export type createRelationFeedbackJSON = {
    status_code: number,
    status_message: string,
}