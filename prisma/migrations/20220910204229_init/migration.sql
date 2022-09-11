-- CreateTable
CREATE TABLE `Organisation` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Organisation_Name_key`(`Name`),
    INDEX `Organisation_Id_idx`(`Id`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrganisationRelation` (
    `IDOrganisationA` INTEGER NOT NULL,
    `IDOrganisationB` INTEGER NOT NULL,
    `Type` INTEGER NOT NULL,

    INDEX `OrganisationRelation_IDOrganisationA_idx`(`IDOrganisationA`),
    INDEX `OrganisationRelation_IDOrganisationB_idx`(`IDOrganisationB`),
    PRIMARY KEY (`IDOrganisationA`, `IDOrganisationB`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Relation` (
    `Id` INTEGER NOT NULL,
    `Name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Relation_Name_key`(`Name`),
    INDEX `Relation_Id_idx`(`Id`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrganisationRelation` ADD CONSTRAINT `OrganisationRelation_Type_fkey` FOREIGN KEY (`Type`) REFERENCES `Relation`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrganisationRelation` ADD CONSTRAINT `OrganisationRelation_IDOrganisationA_fkey` FOREIGN KEY (`IDOrganisationA`) REFERENCES `Organisation`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrganisationRelation` ADD CONSTRAINT `OrganisationRelation_IDOrganisationB_fkey` FOREIGN KEY (`IDOrganisationB`) REFERENCES `Organisation`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
