(function(){
    function go(el){
        var g = {
            mycols: [
                {name:'t', disp:'Symbol', klass:'symbol', type:'ticker'},
                {name:'e', disp:'Exchange', klass:'exchange', type:'string'},
                {name:'l', disp:'Last Price', klass:'price', type:'string'},
                {name:'c', disp:'Change', klass:'change', type:'change'},
                {name:'cp', disp:'% Change', klass:'pctchg', type:'pctchg'},
                {name:'lt_dts', disp:'Last Traded', klass:'datetime', type:'datetime'},
            ],
            styl: '.style-scope.' + el.is,
            prop: {class: 'style-scope ' + el.is}
        };
        function gtag(name){
            return $('<'+name+' />').prop(g.prop);
        }
        function cellByType(type,v,r){
            if(type==='change'){
                var e = $('<span />').prop({class:g.prop.class + (v[0]==='+'?" up":" down")});
                return e.text(v);
            }else if(type==='pctchg'){
                var e = $('<span />').prop({class:g.prop.class + (v>0?" up":" down")});
                return e.text(v+'%');
            }else if(type==='datetime'){
                return v.replace("T"," ").replace("Z","");
            }else if(type==='ticker'){
                var e=$('<a />').prop(Object.assign(g.prop,{href:"https://www.google.com/finance?q="+r.e+":"+v, target:"_blank"}));
                return e.text(v);
            }else{
                return v;
            }
        }
        function isTradingHour(){
            var d=new Date(),h=d.getUTCHours();
            return h<=20 && (h>13 || (h==13 && 30<=d.getMinutes()));
        }
        function onTimer(){
            if(isTradingHour()){
                googleApi();
            }
        }
        function mkThead(cols){
            var tr=gtag('tr');
            cols.forEach(function(c){
                tr.append($('<th />').prop({class:g.prop.class + ' gth'}).text(c.disp));
            });
            return gtag('thead').append(tr);
        }
        function addTbodyRows(parent,cols,rows){
            parent.empty();
            rows.forEach(function(r){
                var tr=gtag('tr');
                cols.forEach(function(c){
                    var e=cellByType(c.type,r[c.name],r);
                    var td=$('<td />').prop({class:g.prop.class + ' ' + c.klass});
                    typeof(e)==='string'?td.text(e):td.append(e);
                    tr.append(td);
                });
                parent.append(tr);
            });
        }
        function googleApi(){
            $.ajax({
                url: el.url,
                dataType: 'json',
                cache: false,
                success: function(rows){
                    addTbodyRows($('tbody').empty(),g.mycols,rows);
                },
                error: function(xhr, status, err){
                    console.error(el.url, status, err.toString());
                }
            });
        }
        var gug = $('#gug'+g.styl);
        gug.append(gtag('table').append(mkThead(g.mycols)).append(gtag('tbody')));
        googleApi();
        setInterval(onTimer, 1000);
    }
    Polymer({
        is : "g3-stocks",
        properties:{
            id:{
                type: String
            },
            url:{
                type: String,
                value: null
            }
        },
        ready: function(){
            go(this); //strive to be thisless
        }
    });
})();
