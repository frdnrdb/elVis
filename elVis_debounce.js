function elVis( query, callback, config ) {

    "use strict";

    if ( window === 'undefined' || typeof query !== 'string' ) return;

    config = config || {};

    var timerInterval = 100,
        eventDelay = 250,
        eventHandler = config.scroll || 'debounce',
        visiblePercentage = config.part || 50,
        visibleMilliseconds = Math.max( (config.time || 500) - eventDelay, 0 ),
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
    if ( query.match( /[>.#:()\[\]]/ ) ) {
        documentQuery = ( docFuncSelector == 'class' ? '.' : docFuncSelector == 'id' ? '#' : '' ) + documentQuery;
        docFuncSelector = 'attr';
    }


    var elements = document[ documentFunc[ docFuncSelector ] ]( documentQuery );
    if ( !elements || elements.length === 0 ) return;
    var list = elements && elements.length ? [].slice.call( elements ) : [ elements ];


    var ecologicalEventHandlers = {
        throttle: function(delay, callback) {
            var previousCall = new Date().getTime();
            return function() {
                var time = new Date().getTime();
                if ((time - previousCall) >= delay) {
                    previousCall = time;
                    callback.apply(null, arguments);
                }
            };
        },
        debounce: function(delay, callback) {
            var timeout = null;
            return function () {
                if (timeout) clearTimeout(timeout);
                var args = arguments;
                timeout = setTimeout(function () {
                    callback.apply(null, arguments);
                    timeout = null;
                }, delay);
            };
        }
    };


    initElVis(list);


    function initElVis( list ) {

        var throttler = ecologicalEventHandlers[eventHandler](eventDelay, check);

        function check() {
            list.remaining = 0;
            list.forEach(checkElVis);
            if (list.remaining === 0) {
              window.removeEventListener( 'scroll', throttler );
            }
        }
        check();
        window.addEventListener( 'scroll', throttler );

    }


    function checkElVis( el, i ) {
        if ( !el ) return;
        if ( isElVis(el) ) startImpressionTime(el, i);
        else pauseImpressionTime(el);
        list.remaining ++;
    }


    function isElVis(el){
        var box = el.getBoundingClientRect(),
            dom = window.innerHeight || document.documentElement.clientHeight,
            visTop = box.bottom - ( box.height * ( visiblePercentage / 100 ) ) < 0,
            visBtm = box.top + ( box.height * ( visiblePercentage / 100 ) ) > dom;
        if ( visTop || visBtm ) return false;
        return true;
    }


    function timer( el, i ) {
        el.vis += timerInterval;
        if ( el.vis > visibleMilliseconds ) {
            el.check = true;
            clearInterval( el.timer );
            callback( {
                item: i + 1 + '/' + list.length,
                top: getOffsetTop( el ),
                time: new Date().toISOString(),
                props: getProps( el, {} )
            }, el );

            list[i] = 0;
        }
    }


    function startImpressionTime(el, i) {
      if ( !el.check ) {
          if ( !el.vis ) el.vis = 0;
          if ( !el.timer ) el.timer = setInterval( function () {
              timer( el, i );
          }, timerInterval );
      }
    }


    function pauseImpressionTime(el) {
        clearInterval( el.timer );
        el.timer = undefined;
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
