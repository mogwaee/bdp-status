fs = require('fs');

function flag(details, jobBranch) {
    console.log("Creating flag");
    //console.log(details);

    let endDate = new Date(details.job.endedDate);
    let statut = details.job.status;
    let nb_documents= 0;
    let nb_pages= 0;
    let message_erreur = "";
    let filiere = "PRINT";
    if (jobBranch === "SPC") {filiere = "GED";}
    console.log("filiere" + jobBranch);


    if (statut === "Completed") {
        statut = "OK"
        if (jobBranch === "IF") {
            nb_documents = details.globalDocuments[0].documentCount;
            nb_pages = details.globalDocuments[0].totalNumberOfPages;
        }
        if (jobBranch === "SPC") {
            for (const element of details.documents){
                nb_pages += element.totalNumberOfPages;
                nb_documents += 1;
            }
        }

    } else {
        statut = "KO";
        message_erreur = details.job.failedReason;
    }


    let flagString = ("<FLAG>\n" +
        `    <DATE>${endDate.toLocaleDateString()}</DATE>\n` +
        `    <HEURE>${endDate.toLocaleTimeString()}</HEURE>\n` +
        `    <STATUT>${statut}</STATUT>\n` +
        `    <NB_DOCUMENTS>${nb_documents}</NB_DOCUMENTS>\n` +
        `    <NB_PAGES>${nb_pages}</NB_PAGES>\n` +
        `    <MESSAGE_ERREUR>${message_erreur}</MESSAGE_ERREUR>\n` +
        `    <FILIERE>${filiere}</FILIERE>\n` +
        "</FLAG>")

    let flagFile = details.job.description + ".flag"

    fs.writeFile(flagFile, flagString, err => {
        if (err) {
            console.error(err)

        }
    })
}

module.exports = { flag };
