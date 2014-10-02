// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

/**
 * @fileOverview This is the js file that loads all the dependencies and init the application.
 * @author <a href="mailto:jleyva@cvaconsulting.com">Juan Leyva</a>
 * @version 1.2
 */

// Base path for all the files required.
var userAgent = MM._getUserAgent();
if (userAgent.indexOf('windows phone 8.0') !== -1){
    requirejs.config({
        paths: {
            root: 'x-wmapp0://www'
        }
    });
} else {
    requirejs.config({
        paths: {
            root: '..'
        }
    });  
}


// Requirements for launching the app, the function is not executed until both
// files are fully loaded.
// We need at least the config.json file with all the settings and the language file.
requirejs(['root/externallib/text!root/config.json', 'root/externallib/text!root/lang/en.json'],
function(config, lang) {
    config = JSON.parse(config);

    // Init the app.
    MM.init(config);
    MM.lang.base = JSON.parse(lang);

    // Once the config and base lang are loaded, we load all the plugins defined in the config.json file.

    if (userAgent.indexOf('windows phone 8.0') !== -1) {
        requirejs.config({
            baseUrl: 'x-wmapp0:www/plugins/',
            packages: config.plugins
        });
    } else {
        requirejs.config({
            baseUrl: 'plugins',
            packages: config.plugins
        });
        
    }
    // We load extra languages if are present in the config file.
    var lang = MM.lang.determine()
    var extraLang = 'root/externallib/text!root/lang/' + lang + '.json';
    config.plugins.unshift(extraLang);

    requirejs(config.plugins,
        function(extraLang) {
            try {
                var langStrings = JSON.parse(extraLang);
                MM.lang.loadLang('core', lang, langStrings);
            } catch(e) {
                MM.log("Unable to load detected language: " + lang);
            }
            $(document).ready(function() {
                // Load the base layout of the app.
                MM.loadLayout();
            });
        }
    );
});
