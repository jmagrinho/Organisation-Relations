import { db } from "../src/utils/db.server"

// RUN SEED COMMAND: npx prisma db seed

// type Organisation = {
//     Name: String;
// }

// type OrganisationRelation = {
//     IdOrganisationA: number;
//     IdOrganisationB: number;
//     Type: number;
// }

type Relation = {
    Id: number;
    Name: string;
}


function getRelations(): Array<Relation> {
    return [
        {
            Id: 1,
            Name: "parent"
        },
        {
            Id: 2,
            Name: "sister"
        },
        {
            Id:3,
            Name: "daughter"
        },
    ]
}

async function seed() {
    await Promise.all(
        getRelations().map((relation) => {
            return db.relation.create({
                data: {
                    Id: relation.Id,
                    Name: String(relation.Name)
                }
            });
        })
    );
}

seed()