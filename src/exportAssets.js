const application = require("application");
const fs          = require("uxp").storage.localFileSystem;

module.exports = async function exportAssets( selection, root, scale, format )
{
    scale  = scale.replace(/\D/g,'');
    scale  = Number(scale);

    if ( format == undefined )
    {
        format = "png";
    }

    //you need an actual selection
    if (selection.items.length <= 0) {
        return;
    }

    //set up file I/O
    const folder = await fs.getFolder();

    const files = [];
    for ( var i = 0; i<selection.items.length; i++ )
    {
        const file = await folder.createFile((selection.items[i].name + "." + format));
        files.push(file);
    }

    //set up renditions array
    const renditions = [];
    for ( var k = 0; k<selection.items.length; k++ )
    {
        renditions.push({
            node: selection.items[k],
            outputFile: files[k],
            type: format,
            scale: scale
        });
    }

    //use application class to print out assets,
    //return render result.
    return application.createRenditions(renditions)
        .then(results => {
            return true;
        })
        .catch(error => {
            return false;
            //console.log(error);
        })
}
