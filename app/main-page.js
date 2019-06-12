const moment = require('moment');
const imageSourceModule = require("tns-core-modules/image-source");
const imgSourceModule = new imageSourceModule.ImageSource();
const fs = require("file-system");

const utilsModule = require("tns-core-modules/utils/utils");

let page;
function onNavigatingTo(args) {
    page = args.object;
    const camera = page.getViewById('camera');
    camera.galleryMax = 10;

    camera
    .on('imagesSelectedEvent',async function(args) {
        var folder = fs.knownFolders.documents();
        var prefix = moment().format('YYYYMMDDHHmmss');

        for(let i = 0; i < args.data.length; i++) {
            var data = args.data[i];
            console.log(data);
            
            //this line below causing memory spike
            var img = await imgSourceModule.fromAsset(data); 

            var path = fs.path.join(folder.path, `${prefix}-${i}.png`);
            var saved = imgSourceModule.saveToFile(path, 'png');

            utilsModule.releaseNativeObject(img);
            utilsModule.releaseNativeObject(data);

            console.log('saved-----', saved);
            console.log('path------', path);
        }

    })
}

exports.openGallery = function() {
    console.log('open gallery')
    page.getViewById('camera').chooseFromLibrary();
}

exports.onNavigatingTo = onNavigatingTo;