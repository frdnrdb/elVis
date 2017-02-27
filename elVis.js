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
        elements = document[documentFunc[selector]](selector === 'attr' ? '['+query+']' : query);

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


          var callbackObject = {
            item: i+1+'/'+list.length,
            seen: new Date().toLocaleString(),
            props: {}
          };

          [].slice.call(el.attributes).forEach(function(o){ if (o.nodeName !== 'style') callbackObject.props[o.nodeName] = o.nodeValue; });

          if (additionalProp) {
            [].slice.call(el.getElementsByTagName('*')).map( function(o){
              var propVal = o[additionalProp] || [].slice.call(o.attributes).map(function(a){ if (a.nodeName === additionalProp) return a.nodeValue; }).join('');
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



}
