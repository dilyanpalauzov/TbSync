Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/AddonManager.jsm");
Components.utils.import("resource://gre/modules/Task.jsm");
Components.utils.import("resource://gre/modules/FileUtils.jsm");

function installAddOn (url, name) {
    return new Promise(function(resolve, reject) {
        let doSilentInstall = function (aAddonInstall) {
            aAddonInstall.install();
            resolve();
        }        
        var nsifile   = new FileUtils.File( url );
        AddonManager.getInstallForFile(nsifile, doSilentInstall, "application/x-xpinstall");
    });
}

function getAddOn (id) {
    return new Promise(function(resolve, reject) {
        let doGetAddon = function (addon) {
            resolve(addon);
        }
        AddonManager.getAddonByID(id, doGetAddon);
    });
}

function sleep(delay) {
    let timer =  Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);        
    return new Promise(function(resolve, reject) {
        let event = {
            notify: function(timer) {
                    resolve();
            }
        }            
        timer.initWithCallback(event, delay, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
    });
}


function install(data, reason) {
}

function uninstall(data, reason) {
}

function startup(data, reason) {
    Task.spawn(function* () {
        try {
            let tbsyncAddOn = yield getAddOn("tbsync@jobisoft.de");
            tbsyncAddOn.userDisabled = true;
        } catch (e) {
            Components.utils.reportError(e);            
        }
        
        yield installAddOn("C:\\Users\\John\\Documents\\GitHub\\DAV-4-TbSync\\DAV-4-TbSync.xpi", "DAV 4 TbSync");
        yield sleep(500);
        yield installAddOn("C:\\Users\\John\\Documents\\GitHub\\EAS-4-TbSync\\EAS-4-TbSync.xpi", "EAS 4 TbSync");
        yield sleep(500);
        yield installAddOn("C:\\Users\\John\\Documents\\GitHub\\TbSync\\TbSync-beta.xpi", "TbSync");	
        yield sleep(500);
        
        let easAddOn = yield getAddOn("eas4tbsync@jobisoft.de");
        let davAddOn = yield getAddOn("dav4tbsync@jobisoft.de");
        let tbsyncAddOn = yield getAddOn("tbsync@jobisoft.de");
        easAddOn.userDisabled = false;
        davAddOn.userDisabled = false;
        tbsyncAddOn.userDisabled = false;

        let thisAddOn = yield getAddOn("tbsyncalpha@jobisoft.de");
        thisAddOn.userDisabled = true;

    }).catch(Components.utils.reportError);
}

function shutdown(data, reason) {
}
