ons.bootstrap()
    .controller('HomeController', function () {
        this.title = 'Herzlich Willkommen';
    })
    .controller('AussenpolitikController', function () {
        this.title = 'Aussenpolitik';
    })
    .controller('InnenpolitikController', function () {
        this.title = 'Innenpolitik';
    })
    .controller('FinanzpolitikController', function () {
        this.title = 'Finanzpolitik';
    })
    .controller('WirtschaftspolitikController', function () {
        this.title = 'Wirtschaft';
    })
    .controller('ArbeitsozialpolitikController', function () {
        this.title = 'Arbeit & Soziales';
    })
    .controller('VerteidigungspolitikController', function () {
        this.title = 'Verteidigung';
    })
    .controller('BildungspolitikController', function () {
        this.title = 'Bildung & Forschung';
    })
    .controller('FamilienpolitikController', function () {
        this.title = 'Familie, Senioren, Frauen & Jugend';
    })
    .controller('GesundheitspolitikController', function () {
        this.title = 'Gesundheit';
    })
    .controller('EnergiepolitikController', function () {
        this.title = 'Umwelt-/Naturschutz, Reaktorsicherheit';
    })
    .controller('VerbraucherschutzpolitikController', function () {
        this.title = 'Ernährung & Verbraucherschutz';
    })
    .controller('StrukturpolitikController', function () {
        this.title = 'Verkehr, Bau & Stadtentwicklung';
    })
    .controller('EntwicklungspolitikController', function () {
        this.title = 'Zusammenarbeit & Entwicklung';
    })
    .controller('JustizController', function () {
        this.title = 'Justiz';
    })

    .controller('AppController', function ($scope) {
        this.load = function (page) {
            $scope.splitter.content.load(page);
            $scope.splitter.left.close();
            $scope.splitter.right.close();
        };
        this.clos = function () {
            $scope.splitter.right.close();
        };
        this.toggle = function () {
            $scope.splitter.left.toggle();
        };
        this.toggle = function () {
            $scope.splitter.right.toggle();
        };
        // Inside MyApp controller
        $scope.handler = function ($event) { };
    });
////////////////////////////////////////////////

ons.ready(function () {
    console.log("Onsen UI is ready!");
    // Hide Page
    document.addEventListener('hide', function (event) {
        //     console.log('hide');
        document.getElementById('navi').classList.add('navi-hide');
        document.getElementById('navi').classList.remove('navi-unhide');
        document.getElementById('navi').classList.remove('navi-show');
    });
    // Init Page
    document.addEventListener('init', function (event) {
        //     console.log('init');
    });
    // Destroy Page
    document.addEventListener('destroy', function (event) {
        //     console.log('destroy');
        document.getElementById('navi').classList.add('navi-unhide');
    });
    // Show Page
    document.addEventListener('show', function (event) {
        //     console.log('show');
        document.getElementById('navi').classList.remove('navi-hide');
        document.getElementById('navi').classList.add('navi-show');
    });
    ////////////////////////////////////////////////
    // Menu Left
    document.querySelector('ons-splitter-side')
        .addEventListener('preopen', function (e) {
            document.getElementById('menu-left').classList.add('ons-splitter-shadow-menu');
            document.getElementById('navi').classList.add('blursl');
        });
    //            document.querySelector('ons-splitter-side')
    //                .addEventListener('postopen', function(e) {
    //                    document.getElementById('navi').classList.add('menu-left-open');
    //                });
    //            document.querySelector('ons-splitter-side')
    //                .addEventListener('preclose', function(e) {
    ////                    document.getElementById('navi').classList.remove('menu-left-open');
    ////                    document.getElementById('navi').classList.add('menu-left-close');
    //                    document.getElementById('navi').classList.remove('menu-left-close');
    //                });
    document.querySelector('ons-splitter-side')
        .addEventListener('postclose', function (e) {
            document.getElementById('navi').classList.remove('blursl');
            document.getElementById('menu-left').classList.remove('ons-splitter-shadow-menu');
        });
    // Menu Right
    document.querySelector("ons-splitter-side#menur")
        .addEventListener('preopen', function (e) {
            document.getElementById('menu-right').classList.add("ons-splitter-shadow-menur");
            document.getElementById('navi').classList.add("blursl");
        });
    //            document.querySelector("ons-splitter-side#menur")
    //                .addEventListener('postopen', function(e) {
    //                    document.getElementById('navi').classList.add("menu-right-open");
    //                    document.getElementById('navi').classList.add("menu-right-close");
    //                    document.getElementById('navi').classList.remove("menu-right-open");});
    //            document.querySelector("ons-splitter-side#menur")
    //                .addEventListener('preclose', function(e) {
    //                    document.getElementById('navi').classList.remove("menu-right-close");
    //                  });
    document.querySelector("ons-splitter-side#menur")
        .addEventListener('postclose', function (e) {
            document.getElementById('navi').classList.remove("blursl");
            document.getElementById('menu-right').classList.remove("ons-splitter-shadow-menur");
        });
});
////////////////////////////////////////////////
function setColor(id) {
    // Menu Left
    // Programm
    document.getElementById('ubersicht').style.color = "white";
    document.getElementById('flyer').style.color = "white";
    document.getElementById('flugblatt').style.color = "white";
    document.getElementById('kurzprogrammsub').style.color = "white";
    document.getElementById('videos').style.color = "white";
    // Politik
    document.getElementById('freundschaftderu').style.color = "white";
    document.getElementById('nahost').style.color = "white";
    document.getElementById('finanzierung').style.color = "white";
    // Partei
    document.getElementById('merkmale').style.color = "white";
    document.getElementById('grundlegendes').style.color = "white";
    document.getElementById('fuhrungskrafte').style.color = "white";
    document.getElementById('beitrag').style.color = "white";
    document.getElementById('spenden').style.color = "white";
    // App
    // document.getElementById('splashscreen').style.color = "white";
    // document.getElementById('wahl2017').style.color = "white";
    document.getElementById('sitemap').style.color = "white";
    // Last Items
    document.getElementById('faq').style.color = "white";
    document.getElementById('kontakt').style.color = "white";
    // Menu Right
    document.getElementById('aussenpolitik').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('innenpolitik').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('finanzpolitik').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('wirtschaft').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('arbeit').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('verteidigung').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('bildung').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('familie').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('gesundheit').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('umwelt').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('ernahrung').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('verkehr').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('zusammenarbeit').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('justiz').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('programm').style.color = "white";
    document.getElementById('programm').style.backgroundColor = "rgb(0, 73, 138)";
    document.getElementById('politik').style.color = "white";
    document.getElementById('politik').style.backgroundColor = "rgb(0, 73, 138)";
    document.getElementById('partei').style.color = "white";
    document.getElementById('partei').style.backgroundColor = "rgb(0, 73, 138)";
    document.getElementById('app').style.color = "white";
    document.getElementById('app').style.backgroundColor = "rgb(0, 73, 138)";
    // Active Link
    document.getElementById(id).style.color = "rgba(250, 125, 9, 0.6)";
    // First Items
    document.getElementById('willkommen').style.color = "white";
    document.getElementById('kurzprogramm').style.color = "white";
    document.getElementById('ytvideos').style.color = "white";
};

function setColorleftmain(id) {
    document.getElementById('programm-list').style.color = "white";
    document.getElementById('politik-list').style.color = "white";
    document.getElementById('partei-list').style.color = "white";
    document.getElementById('app-list').style.color = "white";
    // Last Items
    document.getElementById('faq').style.color = "white";
    document.getElementById('kontakt').style.color = "white";
    // Menu Right
    document.getElementById('aussenpolitik').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('innenpolitik').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('finanzpolitik').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('wirtschaft').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('arbeit').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('verteidigung').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('bildung').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('familie').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('gesundheit').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('umwelt').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('ernahrung').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('verkehr').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('zusammenarbeit').style.color = "rgba(0, 83, 151, 0.8)";
    document.getElementById('justiz').style.color = "rgba(0, 83, 151, 0.8)";
    // First Items
    document.getElementById('willkommen').style.color = "white";
    document.getElementById('kurzprogramm').style.color = "white";
    document.getElementById('ytvideos').style.color = "white";
    document.getElementById('programm').style.color = "white";
    document.getElementById('programm').style.backgroundColor = "rgb(0, 73, 138)";
    document.getElementById('politik').style.color = "white";
    document.getElementById('politik').style.backgroundColor = "rgb(0, 73, 138)";
    document.getElementById('partei').style.color = "white";
    document.getElementById('partei').style.backgroundColor = "rgb(0, 73, 138)";
    document.getElementById('app').style.color = "white";
    document.getElementById('app').style.backgroundColor = "rgb(0, 73, 138)";
};

function setColorleft(id) {
    document.getElementById('programm').style.color = "white";
    document.getElementById('programm').style.backgroundColor = "rgb(0, 73, 138)";
    document.getElementById('politik').style.color = "white";
    document.getElementById('politik').style.backgroundColor = "rgb(0, 73, 138)";
    document.getElementById('partei').style.color = "white";
    document.getElementById('partei').style.backgroundColor = "rgb(0, 73, 138)";
    document.getElementById('app').style.color = "white";
    document.getElementById('app').style.backgroundColor = "rgb(0, 73, 138)";
    document.getElementById(id).style.color = "white";
    document.getElementById(id).style.backgroundColor = "rgba(210, 115, 39, 1)";
};
