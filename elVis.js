function elVis( query, callback, config ) {

    "use strict";

    if ( window === 'undefined' || typeof query !== 'string' ) return;

    config = config || {};

    var timerInterval = 100,
        visiblePercentage = config.part || 50,
        visibleMilliseconds = config.time || 500,
        additionalProp = config.find,
        docFuncSelector = config.selector || 'class',
        documentQuery = docFuncSelector === 'attr' ? '[' + query + ']' : query,
        documentFunc = {
            class:  'getElementsByClassName',
            id:     'getElementById',
            tag:    'getElementsByTagName',
            attr:   'querySelectorAll'
        };

    /*
    use querySelectorAll if the query contains advanced selectors/ pseudo-classes
    */
    if ( query.match( /[.#:()\[\]]/ ) ) {
        documentQuery = ( docFuncSelector == 'class' ? '.' : docFuncSelector == 'id' ? '#' : '' ) + documentQuery;
        docFuncSelector = 'attr';
    }

    var elements = document[ documentFunc[ docFuncSelector ] ]( documentQuery );
    if ( !elements || elements.length === 0 ) return;
    var list = elements && elements.length ? [].slice.call( elements ) : [ elements ],
        remaining = list.length;

    list.forEach( checkElVis );

    function checkElVis( el, i ) {
        function check() {
            if ( remaining === 0 ) window.removeEventListener( 'scroll', check );
            if ( isElVis( el ) ) {
                if ( !el.check ) {
                    if ( !el.vis ) el.vis = 0;
                    if ( !el.timer ) el.timer = setInterval( function () {
                        timer( el, i );
                    }, timerInterval );
                }
            }
            else if ( el.timer ) {
                clearInterval( el.timer );
                el.timer = undefined;
            }
        }
        check();
        window.addEventListener( 'scroll', check );
    }

    function timer( el, i ) {
        el.vis += timerInterval;
        if ( el.vis > visibleMilliseconds ) {
            el.check = true;
            remaining--;
            clearInterval( el.timer );
            callback( {
                item: i + 1 + '/' + list.length,
                top: getOffsetTop( el ),
                time: new Date().toISOString(),
                props: getProps( el, {} )
            }, el );
        }
    }

    function isElVis( el ) {
        var box = el.getBoundingClientRect(),
            dom = window.innerHeight || document.documentElement.clientHeight;
        if ( box.bottom - ( box.height * ( visiblePercentage / 100 ) ) < 0 || box.top + ( box.height * ( visiblePercentage / 100 ) ) > dom ) return false;
        return true;
    }

    function getOffsetTop( el ) {
        var box = el.getBoundingClientRect(),
            body = document.body,
            html = document.documentElement,
            height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight ),
            top = box.top + window.pageYOffset || html.scrollTop || body.scrollTop;
        return Math.round( top ) + '/' + height;
    }

    function getProps( el, obj ) {
        [].slice.call( el.attributes )
            .forEach( function ( o ) {
                if ( o.nodeName !== 'style' ) obj[ o.nodeName ] = o.nodeValue;
            } );
        if ( additionalProp ) {
            [].slice.call( el.getElementsByTagName( '*' ) )
                .map( function ( o ) {
                    var propVal = o[ additionalProp ] || [].slice.call( o.attributes )
                        .map( function ( a ) {
                            if ( a.nodeName === additionalProp ) return a.nodeValue;
                        } )
                        .join( '' );
                    if ( propVal && !obj[ additionalProp ] ) obj[ additionalProp ] = propVal;
                } );
        }
        return obj;
    }

}
