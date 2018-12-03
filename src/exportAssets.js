const application = require("application");
const fs          = require("uxp").storage.localFileSystem;

module.exports = async function exportAssets( selection, root, scale, format )
{
    console.log('selection:');
    console.log( selection.items );
    //you need an actual selection
    if (selection.items.length <= 0) {
        return;
    }

    scale  = scale.replace(/[^\d.-]/g, '');
    scale  = Number(scale);

    if ( format == undefined )
    {
        format = "png";
    }

    var exportSettings = {};

    switch( format )
    {
        case "png":
            //PNG settings
            exportSettings.type        = application.RenditionType.PNG;
            exportSettings.quality     = null;
            exportSettings.scale       = scale;
            exportSettings.minify      = null;
            exportSettings.embedImages = null;
        break;

        case "jpg":
            //JPG settings
            exportSettings.type        = application.RenditionType.JPG;
            exportSettings.quality     = 100;
            exportSettings.scale       = scale;
            exportSettings.minify      = null;
            exportSettings.embedImages = null;
        break;

        case "svg":
            //SVG settings
            exportSettings.type        = application.RenditionType.SVG;
            exportSettings.scale       = null;
            exportSettings.quality      = null;
            exportSettings.minify      = true;
            exportSettings.embedImages = true;
        break

        case "pdf":
            //PDF settings
            exportSettings.type        = application.RenditionType.PDF;
            exportSettings.scale       = null;
            exportSettings.quality     = null;
            exportSettings.minify      = null;
            exportSettings.embedImages = null;
        break;

        default :
            //PNG settings
            exportSettings.type        = application.RenditionType.PNG;
            exportSettings.quality     = null;
            exportSettings.scale       = scale;
            exportSettings.minify      = null;
            exportSettings.embedImages = null;
    }

    console.log(exportSettings);

    //set up file I/O
    const folder = await fs.getFolder();

    const files = [];
    for ( var i = 0; i<selection.items.length; i++ )
    {
        const file = await folder.createFile((selection.items[i].name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + "." + format), {overwrite:true} );
        files.push(file);
    }

    //set up renditions array
    const renditions = [];
    for ( var k = 0; k<selection.items.length; k++ )
    {
        renditions.push({
            node: selection.items[k],
            outputFile: files[k],
            type: exportSettings.type,
            scale: exportSettings.scale,
            quality: exportSettings.quality,
            minify: exportSettings.minify,
            embedImages: exportSettings.embedImages,
        });
    }

    //use application class to print out assets,
    //return render result.
    return application.createRenditions(renditions)
        .then(results => {
            return true;
        })
        .catch(error => {
            //console.log(error);
            return false;
        })
}
