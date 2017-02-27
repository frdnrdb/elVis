function elVis ( query, callback, config ) {

    config = config || {};

    if (typeof window === 'undefined' || typeof query !== 'string') return;

    var visiblePercentage = config.part || 50,
        visibleMilliseconds = config.time || 500,
        additionalProp = config.find,
        selector = config.selector || 'class',
        documentFunc = {
          class: 'getElementsByClassName',
          id: 'getElementById',
          tag: 'getElementsByTagName',
          attr: 'querySelectorAll'
        },

        documentQuery = selector === 'attr' ? '['+query+']' : query;

        // use querySelectorAll if the query contains advanced selectors/ pseudo-classes
        if ( query.match(/[.#:()\[\]]/) ) {
          documentQuery = (selector == 'class' ? '.' : selector == 'id' ? '#' : '') + documentQuery;
          selector = 'attr';
        }

        elements = document[documentFunc[selector]](documentQuery);

    if (!elements || elements.length === 0) return;

    var list = elements && elements.length ? [].slice.call(elements) : [elements],
        size = list.length,
        timerInterval = 100;

    list.forEach( checkElVis );




    function checkElVis(el,i) {

        function check() {

          if (size === 0) window.removeEventListener('scroll', check);

          if ( isElVis(el) ) {
            if ( !el.check ) {
              if ( !el.vis ) el.vis = 0;
              if ( !el.timer ) el.timer = setInterval( function(){ timer(el, i); }, timerInterval);
            }
          }
          else if ( el.timer ) {
            clearInterval( el.timer );
            el.timer = undefined;
          }

        }

        check();
        window.addEventListener('scroll', check);

    }



    function timer(el, i) {

      el.vis += timerInterval;

      if (el.vis > visibleMilliseconds) {

          el.check = true;
          size--;
          clearInterval(el.timer);


          // callback object

          var callbackObject = {
            item: i+1+'/'+list.length,
            top: getOffset(el),
            time: new Date().toLocaleString(),
            props: {}
          };

          [].slice.call(el.attributes).forEach(function(o){ if (o.nodeName !== 'style') callbackObject.props[o.nodeName] = o.nodeValue; });

          if (additionalProp) {
            [].slice.call(el.getElementsByTagName('*')).map( function(o){
              var propVal = o[additionalProp] || [].slice.call(o.attributes).map(function(a){ if (a.nodeName === additionalProp ) return a.nodeValue; }).join('');
              if (propVal && !callbackObject.props[additionalProp]) callbackObject.props[additionalProp] = propVal;
            });
          }

          callback(callbackObject, el);

      }

    }



    function isElVis(el) {

      var box = el.getBoundingClientRect(),
          dom = window.innerHeight || doc.documentElement.clientHeight;

      if (box.bottom-(box.height*(visiblePercentage/100)) < 0 || box.top+(box.height*(visiblePercentage/100)) > dom) return false;

      return true;

    }



    function getOffset(el) {

        var box = el.getBoundingClientRect(),
            body = document.body,
            html = document.documentElement,
            height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight ),
            top = box.top + window.pageYOffset || html.scrollTop || body.scrollTop;

        return { percent: Math.round(top*100/height), pixels: Math.round(top)+'/'+height };
    }



}
