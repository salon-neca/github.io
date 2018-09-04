$(document).ready(function()
{
  var versionCode= 'v32g Aug\'18. \n';
  var appPath= 'https://snn.glitch.me';
  $.ajaxSetup({async:true, // dataType:'text',
               contentType:'text/plain; charset=utf-8', cache:false, timeout:19999});


  var nBar= document.getElementById('notif');
  var adminInfo= document.getElementById('dbFrame');
  

  var jju= (localStorage.getItem('ju')) ? 999 : 7999;
  
   
  var updateReady= 0;
  var udCheck= setTimeout(function()
  {
    $('#pasIn').css({display:'inline'});
    $('#pasIn')[0].disabled= false;
    $('#log4But')[0].disabled= false;
    
    $('#log4But').val('LogMe');
    $('#pasIn').focus();

  }, jju);
  

  navigator.serviceWorker.register('sw.js')
  .then(function(reg) {
      reg.addEventListener('updatefound', function() {
        var iw= this.installing;
  //      alert('iw.state='+ iw.state);
        
        clearTimeout(udCheck);
        
        $('#log4But').val('Update found, installing...');

        updateReady= 1;
        adminInfo.innerText+= 'UPDATE:pending \n';

        iw.addEventListener('statechange', function() {
  //        alert('this.state='+this.state);
          if(this.state === 'activated') {
            localStorage.setItem('ju', '!');
            window.location.reload(true);
          }
          
        });
      });
  }).catch(function(err) {
    adminInfo.innerText+= 'SW fail:'+ err +'\n';
  });
  
  //window.onbeforeunload= function() { return "Reload database?"; }


  var autoSave= true;
  if(appPath === 'https://sns.glitch.me') autoSave= false;
  

  var dggON= false, dggY1, dggY2, recT;
  var dragging= function(x)
  {
    var dm, jq= (curTab !== 2)? $('#t1arnd')[0] : $('#t2arnd')[0];

    recT= jq.getBoundingClientRect();
    dm= (dggY2 - dggY1) *3;
    jq.scrollTop+= dm;
    dggY2= dggY1;
  }

  $('#t1arnd, #t2arnd').bind('mousedown', function(e)
  {

    dggON= true; dggY1= dggY2= e.pageY;
  });
  $('#t1arnd, #t2arnd').bind('mousemove', function(e)
  {
    if(dggON)
    {
      e.preventDefault();
      dggY1= e.pageY;
      dragging(this);
    }
  });
  $('html').bind('mouseup', function(e)
  {
//    if(dggON) e.preventDefault();
    dggON= false; dggY1= dggY2= e.pageY;
  });



  
  var nextID= 0;
  var nextHD= 0;

  var syncID= '*';
  var dbPass= '*';
  var isLogged= false;
  var ttxt= 'Importing...';

  var curTab= 1;
  var lastTab= 0;

  var edtRow= [-1, -1,-1];
  var editMode= false;
  var mergMode= false;

  var tbSpc= [0, '40px','40px','300px'];
  var tbLst= [0, 1,1];
  var tbSrt= [0, 2,1];
  var tbAll= [99, 99,99];

  var fi1Hdr= [0, '',''];
  var fi2Hdr= [0, '',''];
  
  var fi1Mod= [0, 1,1];
  var fi2Mod= [0, 1,1];
  var fi1Inp= [0, '',''];
  var fi2Inp= [0, '',''];

  var tblInf= [0, '~tI1','~tI2'];
  var fltInf= [0, '~fI1','~fI2'];

  var recNum= [0, 0,0];
  var recFil= [0, 0,0];
  var fltNum= [0, 0,0];

// *** PLAYER TAB
  var plTab= [];
// *** HISYORY TAB TABLE
  var hiTab= [];

// ***         0   1   2   3   4   5  
// *** plTab: id. frs lst pho mob mmo
// ***         0   1   2   3   4
// *** hiTab: no. dtm ~id trt crm


  var lastNotif= '';
  function clrAdmin(a)
  {
    if(!a) adminInfo.innerText= versionCode;
    if(nBar.innerText !== '..') {
      lastNotif= nBar.innerText; nBar.innerText= '..'; }
  }

  function fNum(n)
  {
    if(isNaN(n)) return '~NaaN';
  
    var x= (n < 0);
    n= Math.abs(n).toString()
             .replace(/\B(?=(\d{3})+(?!\d))/gi, ',');
    if(x) n= '−'+ n;
    return n;
  }
  
  function setRowCol(ct)
  {
    if(!ct) ct= curTab;
    switch(ct)
    {
      case 1:
        $('#ptb>tr').css({border:'none'});
        $('#ptb>tr').not('.selR, .xtrR').removeClass().addClass("clnR");

        $('#ptb>tr.xtrR').css({background:'#303030'});
        $('#ptb>tr.xtrR').find('pre').css({color:'white', background:'black'});
        switch(tbLst[ct])
        {
          case 1:
            $('#ptb>tr').not('.selR, .xtrR').removeClass('clnR');
          break;

          case 2:
            $('#ptb>tr').css({'border-top':'1px solid lightgrey'});
            $('#ptb>tr.xtrR').css({background:'#dadada'});
            $('#ptb>tr.xtrR').find('pre').css({color:'black', background:'#f0f0f0'});
          break;

          case 3:
            $('#ptb>tr.xtrR').css({background:'black'});
            $('#ptb>tr.xtrR').find('pre').css({color:'lightgrey', background:'#303030'});
          break;
        }
      break;

      case 2:
        $('#htb>tr').css({border:'none'});
        $('#htb>tr').removeClass().addClass("clnR");
        switch(tbLst[ct])
        {
          case 1: $('#htb>tr').removeClass(); break; 
          case 2: $('#htb>tr').css('border-top', '1px solid lightgrey');
        }
      break;
    }
  }

  function setRowSpc(ct)
  {
    var tt; if(!ct) ct= curTab;
    switch(ct)
    {
      case 1: tt= $('#ptb>tr'); break;
      case 2: tt= $('#htb>tr'); break;
      case 3: tt= $('#dbFrame'); break;
    }
    if(tt.css('height') !== tbSpc[ct]) tt.css({height:tbSpc[ct]});
  }

  // *** this good now, use as template
  function rowAnim(i, o)
  {
    var jq= '#ptb>tr';
    if(curTab === 2) jq= '#htb>tr';

    var b, r= $(jq)[i];
    
    if(curTab === 2) b= tblInf[2];
    else {
      b= tblInf[1]; if($('#tmpD')) $('#tmpD').remove(); }

    if(!o)
    {
      $(r).removeClass(); nBar.innerText= b;
      if(tbLst[curTab] !== 1) $(r).addClass('clnR');

      return;
    }

    if(curTab === 1 && mergMode)
    {
      var xc= 'DUPLICAT: '+ r.innerText;

      $('#tmpX').after('<p id="tmpD" style="color:white; margin-top:3px; '
        +'padding:5px 9px; overflow:hidden; text-overflow:ellipsis; '
        +'white-space:nowrap; font-size:17px; background:grey">'+ xc +'</p>');
    }

    $(r).removeClass('clnR').addClass('selR');

    var c= (curTab !== 2) ?
        r.cells[0].innerText : r.cells[2].innerText;
    nBar.innerText= b + ' [@]'+ c +':'+ id2nme(+c);
  }

  function resetEdit(tab, jin)
  {
    if(tab !== 2) tab= 1;

    edtRow[tab]= -1
    if(tab === 2)
    {
      $('#ta2rmv')[0].disabled= true;
      $('#ta2sub')[0].disabled= true;

      $('#ta2sub').val('Edit Session');
      $('#t2e0, #t2e1y, #t2e1m, #t2e1d, #t2e1h, #t2e2, #t2e3').val( '' );

      $('#t2e0').val( 'Next #No. '+ nextHD );

      $('#t2e1y')[0].disabled= true;
      $('#t2e1m')[0].disabled= true;
      $('#t2e1d')[0].disabled= true;
      $('#t2e1h')[0].disabled= true;

      $('#t2e2')[0].disabled= true;
      $('#t2e3')[0].disabled= true;

      if(jin) return;
      $('#htb>tr.xtrR').remove();
      $('#htb>tr').removeClass();
      if(tbLst[2] !== 1) $('#htb>tr').addClass('clnR');
      return;
    }

    $('#ta1mrg')[0].disabled= true;
    $('#ta1rmv')[0].disabled= true;
    if(mergMode)
      $('#ta1sub')[0].disabled= true;
    else
      $('#ta1sub')[0].disabled= false;

    $('#ta1sub').val('New Client');
    $('#t1e0').val( 'Next #Id. '+ nextID );

    $('.clPinf').css({display:'none'});
    $('#t1e1').val(''); $('#t1e2').val('');
    $('#t1e3').val(''); $('#t1e4').val('');

    if(jin) return;
    $('#ptb>tr.xtrR').remove();
    $('#ptb>tr').removeClass();
    if(tbLst[1] !== 1) $('#ptb>tr').addClass('clnR');
  }

  function sortem(tab, hc)
  {
    tbSrt[tab]= hc;
    var hdr, rev= (hc < 0);
    hc= Math.abs(hc)-1;

    var t= plTab;
    if(tab !== 1) t= hiTab;
    if(t.length < 2) return;

    var re, ma, tht= !(hc === 0);
    if(tab === 2) tht= (hc === 3);
    if(tht)
    { // alpha
      var ma= t.map(function(r, i) { return [ r[hc], i ]; });
      ma.sort(function(a, b) {
        return (b[0] > a[0])? -1:((b[0] < a[0])? 1:0); });
//      window.radixSortLSD(ma, function getKey(e) { return e[0]; });
      re= ma.map(function(r) { return t[r[1]]; });
      re.forEach(function(r, i) { t[i]= r; });
    }
    else
    { // numeric
      ma= t.map(function(r, i) { return [ -r[hc], i ]; });
      window.radixSortLSD(ma, function getKey(e) { return e[0]; });
      re= ma.map(function(r) { return t[r[1]]; });
      re.forEach(function(r, i) { t[i]= r; });
    }


    if(rev) t.reverse();
    
    if(tab === 1)
    { // *** header
      $('#pth>tr').children().css({border:'none'});
      $("#pth>tr").children().eq(hc).css({border:'2px solid grey'});
      
      $('#t1F').val('');
      if(hc === 0) {
        $('#t1F').attr({placeholder:'#Id.'}); hdr= '0#Id.'; }
      else
      if(hc < 3) {
        $('#t1F').attr({placeholder:'NAME'}); hdr= '2NAME'; }
      else {
        $('#t1F').attr({placeholder:'PHONE'}); hdr= '4PHONE'; }
    }
    else
    if(tab === 2)
    { // *** header
      $('#hth>tr').children().css({border:'none'});
      $('#hth>tr').children().eq(hc).css({'border':'2px solid grey'});

      $('#t2F').val('');
      if(hc === 0) {
        $('#t2F').attr({placeholder:'#No.'}); hdr= '0#No.'; }
      else
      if(hc === 1) {
        $('#t2F').attr({placeholder:'YYYYMMDDHH'}); hdr= '1DATE'; }
      else
      if(hc === 2) {
        $('#t2F').attr({placeholder:'#Id.'}); hdr= '2#Id.'; }
      else
      if(hc > 2) {
        $('#t2F').attr({placeholder:'SESSION'}); hdr= '3SESSION'; }
    }

    if(fltNum[tab] === 0)
      fi1Hdr[tab]= fi2Hdr[tab]= hdr;
    else
      fi2Hdr[tab]= hdr;
  }
  
  function curDTM()
  {
    var curDate= new Date();
    var r= curDate.getFullYear()
               + ("00"+(curDate.getMonth()+1)).slice(-2)
               + ("00"+curDate.getDate()).slice(-2)
               + ("00"+curDate.getHours()).slice(-2);
    return r;
  }

  function chunkStr(n, s)
  {
    var i, r, ch= [];
    for(i= 0; i < s.length; i+= n)
    {
      r= s.substr(i, n);
      if(r[0] === ' ')
        r= r.substr(1) + s[n + i++];
      ch.push( r );
    }
    return ch.join('\n            ');
  }

  function id2nme(c,a)
  {
    if(!a) a= ' ';
    for(var i= 0; i < plTab.length; i++)
    {
      if(plTab[i][0] === c) 
        return (plTab[i][1] +a+ plTab[i][2]);
    }
    return '~notFound@'+ c;
  }

  function id2trs(rx)
  {
    var i, rFrm, rCln, ful, q, x, ch2, ppp, ns, tn= 0;
    var trs= [], cs= '';
    
    for(i= 0; i < hiTab.length; i++)
    {
      x= hiTab[i];
      if(x[2] === rx)
      {
        tn++;
        trs.push([ x[1], chunkStr(59, x[3]), chunkStr(59, x[4]), x[0] ]);
      }
    }

    trs.sort(function(a, b) {
      return a[3] - b[3]; });

    trs.forEach(function(tr, i)
    {
      i++;
      ns= '#'+ ('00'+i).slice(-3) +'.';
      ppp= ns +'DATE:  '+ ndt2sdt(tr[0]) +'\nTREATMENT:  ' +tr[1];
      cs+= ppp+'\n   CREAMS:  '+ tr[2] +'\n\n';
    });

    return cs;
  }

  function id2mmo(c)
  {
    var i;
    for(i= 0; i < plTab.length; i++)
    {
      if(plTab[i][0] === c) return plTab[i][5];
    }
    return '~notFound@'+ c;
  }


  // *** FILTERS
  function fiTab1(i, hdr, mod, inp)
  {
    var x, a, b, n, t= 1;
    x= plTab[i];
    hdr= +hdr[0];
    if(hdr === 0)
    {
      a= ''+x[0];
      n= a.indexOf(inp);
      if(mod === 2) { if(n >= 0) return true; }
      if(mod === 1) { if(n === 0) return true; }
      if(mod === 9) { if(+a === +inp) return true; }
    }
    else
    {
      a= x[1].indexOf(inp);
      b= x[2].indexOf(inp);
      if(hdr > 2) {
        a= x[3].indexOf(inp);
        b= x[4].indexOf(inp);
      }
      if(mod === 2) { if(a >= 0 || b >= 0) return true; }
      if(a === 0 || b === 0) return true;
    }
    return false;
  }

  function fiTab2(i, hdr, mod, inp)
  {
    var x, a, b, n, t= 1;
    x= hiTab[i];
    hdr= +hdr[0];
    a= ''+x[hdr];
    n= a.indexOf(inp);
    
    if(mod === 2) {
      if(n >= 0) return true; }
    else
    if(mod === 1) {
      if(n === 0) return true; }
    else
    if(mod === 9) {
      if(+a === +inp) return true; }

    return false;
  }

  // ____________________________________________________________________
  // *** tabs# redraw... ************************************************
  function freshTab1()
  {
    recFil[1]= 0;
    $("#ptb").empty();
    var i, x, tth, rn= 0;
    if(tbAll[1] === 0) tbAll[1]= plTab.length;
    var stop= Math.min(tbAll[1], plTab.length);
    for(i= 0; i < plTab.length; i++)
    {
      tth= true;
      if(fltNum[1] > 0)
        tth= tth && fiTab1(i, fi1Hdr[1], fi1Mod[1], fi1Inp[1]);

      if(fltNum[1] > 1)
        tth= tth && fiTab1(i, fi2Hdr[1], fi2Mod[1], fi2Inp[1]);

      if(rn < stop && tth)
      {
        x= plTab[i];
        $('#ptb').append( '<tr tabindex="1">'
                        +'<td class="admin" style="width:59px">'+ x[0]
                        +'</td><td>'+ x[1]
                        +'</td><td>'+ x[2]
                        +'</td><td>'+ x[3]
                        +'</td><td>'+ x[4] 
                         // x[5] is memo
                        +'</td></tr>' );
        rn++;
      }
      if(tth) recFil[1]++;
    }

    recNum[1]= rn;
    tbAll[1]= tbAll[0];

//    if(i === plTab.length) $('#t1all')[0].disabled= true;
  //  else $('#t1all')[0].disabled= false;
  }

  var msa= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
                          'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  function ndt2sdt(n)
  {
    n= (''+n);
    var m= +(n.substr(4,2));
    return n.substr(6,2) +' '+ msa[m-1]
      +"`"+ n.substr(2,2) +' :'+n.substr(8,2) +'h';
  }

  function sdt2ndt(s)
  {
    var y, m, d, h;
    y= '20'+ s.substr(7,2);
    m= s.substr(3,3);
    m= 1+ msa.indexOf(m);
    d= s.substr(0,2);
    h= s.substr(11,2);
    return +(y + ('0'+m).slice(-2) + d + h);
  }

  function freshTab2()
  {
    recFil[2]= 0;
    $('#htb').empty();
    var i, x, tth, rn= 0;
    if(tbAll[2] === 0) tbAll[2]= hiTab.length;
    var stop= Math.min(tbAll[2], hiTab.length);

    for(i= 0; i < hiTab.length; i++)
    {
      tth= true;
      if(fltNum[2] > 0)
        tth= tth && fiTab2(i, fi1Hdr[2], fi1Mod[2], fi1Inp[2]);

      if(fltNum[2] > 1)
        tth= tth && fiTab2(i, fi2Hdr[2], fi2Mod[2], fi2Inp[2]);

      if(rn < stop && tth)
      {
        x= hiTab[i];
        $('#htb').append( '<tr tabindex="1"></td>'
                         +'<td style="font-size:11px; width:59px">'+ x[0]
                         +'<td style="text-align:center; width:149px">'+ ndt2sdt(x[1])
                         +'</td><td class="admin" style="text-align:right; width:70px">'+ x[2]
                         +'</td><td >'+ ' TR: '+ x[3] +'\n CR: '+ x[4]
                         +'</td></tr>');
        rn++;
      }
      if(tth) recFil[2]++;
    }

    recNum[2]= rn;
    tbAll[2]= tbAll[0];
    
//    if(i === hiTab.length) $('#t2all')[0].disabled= true;
  //  else $('#t2all')[0].disabled= false;
  }

            
  function tiFresh(w)
  {
    var s, tn= curTab, jq= $('#t2FinfBar');
    if(tn !== 2) { tn= 1; jq= $('#t1FinfBar'); }

    if(!w && fltNum[tn] === 0) {
      jq.text('No Filters..'); return; }


    var fn= fltNum[tn];
    var m1= fi1Mod[tn], m2= fi2Mod[tn];
    var e1= '<equals>', e2= '<equals>';
    var i1= fi1Inp[tn] +'"', i2= fi2Inp[tn] +'"';
    var h1= fi1Hdr[tn].substr(1), h2= fi2Hdr[tn].substr(1);
    
    if(w === 1) {
      fn++;
      if(fn !== 2) i1= '..';
      else i2= '..';
    }

    if(m1 < 9) {
      e1= (m1 === 1)?
        '<begins with>' : '<contains>';
    }
    s= '1.'+ h1 + e1 +'"'+ i1;
    
    if(fn > 1)
    {
      if(m2 < 9) {
        e2= (m2 === 1)?
          '<begins with>' : '<contains>';
      }
      s+= '  2.'+ h2 + e2 +'"'+ i2;
    }
    jq.text(s);
  }

  function resetVsize()
  {
    var a, b, c, j, i= curTab;
    c= (i !== 2)? $('#t1arnd')[0] : $('#t2arnd')[0];
    j= (i !== 2)? $('#t1F') : $('#t2F');
    b= c.getBoundingClientRect();
    a= (window.innerHeight - b.top) -9;
    $(c).css({height:a});

    if(i === 2)
    {
      var q= edtRow[2];
      if(q >= 0) setScroll($('#htb>tr')[q]);
    }

    j.focus();
  }

  function reFresh()
  {
    var i= curTab,
        j1, j2, a, b, c;

    $('#mtb1').val(ttxt);
    switch(curTab)
    {
      case 1: freshTab1();
        j1= $('#t1fil'), j2= $('#t1F');
        a= recNum[i]; b= recFil[i]; c= plTab.length;
        $('#t1end')[0].innerText=
          ' DISPLAY:'+fNum(a)+'  FILTER:'+fNum(b)+'  TOTAL:'+fNum(c);
      break;
      case 2: freshTab2();
        j1= $('#t2fil'), j2= $('#t2F');
        a= recNum[i]; b= recFil[i]; c= hiTab.length;
        $('#t2end')[0].innerText=
          ' DISPLAY:'+fNum(a)+'  FILTER:'+fNum(b)+'  TOTAL:'+fNum(c);
      break;
    }
    
    setRowSpc(); setRowCol();
    nBar.innerText= tblInf[i]= ' [#]'+ a +'/'+ b +'('+ c +')';
    
    if(fltNum[i] === 0)
    {
      j1[0].disabled= false;
      j2[0].disabled= false;
    }

    if(fltNum[i] < 3)//b < fltMax[i] && 
    {
      if(fltNum[i] === 2)
      {
        j1[0].disabled= true;
        j2[0].disabled= true;
      }
    }

    j2.val('');
    tiFresh();

// emmm...
    if(editMode) $(".admin").css("display", "table-cell");
    else $(".admin").css("display", "none");

    window.scrollTo(0,0);
    resetVsize();

    if(i !== 2)
      $('#t1arnd')[0].scrollTop= 0;
    else
      $('#t2arnd')[0].scrollTop= 0;
  }
  // *** END REFRESH *****************************************

  function formatSession(a, clr)
  {
    clr= (!clr)? '':'~';
    a= a.replace(/\n|\r|\t/gi, ' ');
    a= a.replace(/\s+/g,' ').trim();
    if(a === ' ' || a === '') a= clr;
    return a;
  }

  function setScroll(x)
  {
    var y= (curTab !== 2) ?
        $('#t1arnd')[0] : $('#t2arnd')[0];

    var ri= x.getBoundingClientRect();
    var ro= y.getBoundingClientRect();

    if(ri.top < ro.top)
      y.scrollTop-= ro.top- ri.top+60; //2top

    ri= x.getBoundingClientRect();
    ro= y.getBoundingClientRect();
    if(ri.bottom > ro.bottom)
      y.scrollTop-= ro.bottom- ri.bottom-30; //2btt
  }


  $('#ptb').on('keyup', function(e)
  {
    var et= e.target;
    if($(et).hasClass('clPinf'))
    {
      e.stopPropagation();
      e.preventDefault();

      var tv= ''+et.value;
      tv= tv.toLowerCase();

      if($(et).hasClass('qwer'))
        et.value= tv.replace(/[^0-9]/gi, '');
      else
        et.value= tv.replace(/[^A-Z 0-9\-,\+.]/gi, '');
    }
  });

  var noRst= false;
  $('#ptb').click(function(e)
  {
    var i, tmp, cid, et= e.target;
    if($(et).hasClass('ord3'))
    {
      cid= $(et).closest('tr')[0]
        .previousSibling.firstChild.innerText;
      cid= +cid;

      var epp, svgBtn= $(et.parentNode).find('.vsiz')[0];
      if(et.value[0] === '.')
      { 
        tmp= $(et).closest('td')[0].firstChild;
        
        if(+tmp.offsetHeight > 177)
          $(tmp).css({height:'175px'});
        else
          $(tmp).css({height:'auto'});
        
        tmp.scrollTop= tmp.scrollHeight;
      }
      else
      if(et.value[0] === 'E')
      {
        epp= et.previousSibling;
        $(epp).before(
           '<textarea class="clPinf" placeholder="MEMO" rows="5" onkeyup="mmm()" '
          +'style="width:100%; margin:9px 0; padding:9px; text-align:left; display:block" ></textarea>');

//        svgBtn.disabled= true;
        et.value= 'Apply Edit';
        et.previousSibling.disabled= true;

        epp= epp.previousSibling;
        epp.innerText= id2mmo(cid);

        epp.focus();
      }
      else
      if(et.value[0] === 'A')
      {
        et.value= 'Edit Memo';
        epp= et.previousSibling;
        epp.disabled= false;

        epp= epp.previousSibling;
        // *** save plTab
        for(i=0; i < plTab.length; i++)
        {
          if(plTab[i][0] === cid) {
            plTab[i][5]= formatSession(epp.value); break; }
        }
        
        tmp= $(et).closest('td')[0].firstChild;
        tmp.innerText= id2trs(cid) +'\n**** MEMO:  '+ chunkStr(59, id2mmo(cid)) +'\n\n';

        svgBtn.disabled= false;
        $(tmp).css({height:'auto'});
        if(+tmp.offsetHeight > 175)
          $(tmp).css({height:'175px'});
        else
          svgBtn.disabled= true;

        tmp.scrollTop= tmp.scrollHeight;
        $(epp).remove();

// *** S A V E ------------------------------------
        if(autoSave) setTimeout(function() { saveDB(); }, 99);
      }
      else
      if(et.value[0] === 'N')
      {
        $(et).before(
           '<input class="clPinf qwer" type="tel" style="margin:0 7px 7px 0; height:25px; width:10%; float:left" placeholder="DD" autocomplete="off" > '
          +'<input class="clPinf qwer" type="tel" style="margin:0 7px 7px 0; height:25px; width:10%; float:left" placeholder="MM" autocomplete="off" > '
          +'<input class="clPinf qwer" type="tel" style="margin:0 9px 7px 0; height:25px; width:15%; float:left" placeholder="YYYY" autocomplete="off" > '
          +'<b class="qwer" style="color:lightgrey; float:left">  :</b>'
          +'<input class="clPinf qwer" type="tel" style="margin:0 7px 7px 3px; height:25px; width:10%; float:left" placeholder="HH" autocomplete="off" > '
          
          +'<textarea class="clPinf" placeholder="TREATMENT" rows="3" '
          +'style="width:100%; margin:0; padding:9px; text-align:left; display:block" ></textarea>'
          +'<textarea class="clPinf" placeholder="CREAMS" rows="2" '
          +'style="width:100%; margin:9px 0; padding:9px; text-align:left; display:block" ></textarea>');

//        svgBtn.disabled= true;
        et.value= 'Finish & Save';
        et.nextSibling.disabled= true;
        tmp= et.previousSibling; //creams
        epp= tmp.previousSibling; //treatment

        i= curDTM();
        $('.qwer')[0].value= i.substr(6,2);
        $('.qwer')[1].value= i.substr(4,2);
        $('.qwer')[2].value= i.substr(0,4);
        $('.qwer')[4].value= i.substr(8,2);

        epp.focus();
      }
      else
      if(et.value[0] === 'F')
      {
        tmp= $(et).closest('td')[0].firstChild.nextSibling;
        var tre, cre,
            dtm, dd, mm,yy, hh;
            dd= $('.qwer')[0].value;
            mm= $('.qwer')[1].value;
            yy= $('.qwer')[2].value;
            hh= $('.qwer')[4].value;

        tmp= ('2018'+ yy).slice(-4) + ('00'+ mm).slice(-2)
          + ('00'+ dd).slice(-2) + ('00'+ hh).slice(-2);
        dtm= +tmp;

        $('.qwer').remove();

        et.value= 'New Session';
        et.nextSibling.disabled= false;
        tmp= et.previousSibling; //creams
        epp= tmp.previousSibling; //treatment
        
        tre= ''+epp.value, cre= ''+tmp.value;
        $(epp).remove(); $(tmp).remove();

        // *** save hiTab
        hiTab.push([ nextHD++, dtm, cid,
                     formatSession(tre), formatSession(cre) ]);

        tmp= $(et).closest('td')[0].firstChild;
        tmp.innerText= id2trs(cid) +'\n**** MEMO:  '+ chunkStr(59, id2mmo(cid)) +'\n\n';

        svgBtn.disabled= false;
        $(tmp).css({height:'auto'});
        if(+tmp.offsetHeight > 175)
          $(tmp).css({height:'175px'});
        else
          svgBtn.disabled= true;

        tmp.scrollTop= tmp.scrollHeight;

// *** S A V E ------------------------------------
        if(autoSave) setTimeout(function() { saveDB(); }, 99);
      }


// *** endinner xtrT
      nBar.innerText= ' @'+ cid +':'+ id2nme(cid);
      tmp= $(e.target).closest('tr')[0];
      setScroll(tmp);

      return;
    }


    if( $(et).hasClass('clPinf') 
       || ($(et).is('td') && $(et.parentNode).hasClass('xtrR')) )
    {
      return;
    }
//    e.stopPropagation(); e.preventDefault();

    var row, tx;
    if(!$(et).is('tr')) row= $(et).closest('tr')[0];
    tx= row.rowIndex; if($(row).hasClass('xtrR')) tx--;

//    nBar.innerText='tx='+tx; return;
    row= $('#ptb>tr')[tx];
    cid= +row.cells[0].innerText;

    // *** subRow-content - REMOVE
    if($(row).hasClass('selR'))
    {
      //subrowDelete(row.nextSibling);
      rowAnim(tx, false);
      $(row.nextSibling).remove();
      resetEdit(curTab, true);
      return;
    }

    if(!mergMode)
      resetEdit(1, false);
    
    edtRow[1]= tx= row.rowIndex;

    // *** subRow-content - CREATE
    if(editMode)
    {
      $('#ta1sub').val('Edit Client');
      $('#t1e0').val( cid );
      $('#t1e1').val( row.cells[1].innerText );
      $('#t1e2').val( row.cells[2].innerText );
      $('#t1e3').val( row.cells[3].innerText );
      $('#t1e4').val( row.cells[4].innerText );

      $('#ta1mrg')[0].disabled= false;
      if(mergMode)
      {
        $('#ta1rmv')[0].disabled= true;
        $('#ta1sub')[0].disabled= true;
      }
      else
      {
        $('#ta1rmv')[0].disabled= false;
        $('#ta1sub')[0].disabled= false;
      }
    }
    
    var xTxt= id2trs(cid) +'\n**** MEMO:  '
                + chunkStr(59, id2mmo(+cid)) +'\n\n';

    var cn= 25, plInf= ''+ cid +':'+ id2nme(cid);
//    plInf= '12345678901234567890123456789012345#';
    if(plInf.length > cn) plInf= plInf.substr(0,cn-2) +'..';
    else plInf= plInf.substr(0,cn);

    rowAnim(tx, true);

    {
      $(row).after(
          '<tr class="xtrR" style="width:95%"><td align="center" colspan='+ (editMode? 5:4) +'>'
        + '<pre class="popo" style="padding:9px 9px; margin:5px 0 7px; text-align:left; height:auto; '//pointer-events:none 
        + 'font-size:14px; border:1px dashed grey; user-select:text; text-align:left; overflow:hidden ">' 
        + ''+ xTxt +'</pre>' 
        + '<input class="ord3" type="button" style="float:right" value="New Session" >'
        + '<input class="ord3" type="button" style="float:right" value="Edit Memo" >'

        +'<input class="ord3 vsiz" type="button" value=".." '
        +'style="padding:7px 0; font-weight:bold; width:50px; margin:0 9px; float:right" >'

        + '<pre style="font-size:15px; float:left;margin:0; width:240px; '//border-right:1px solid red; '
        + 'pointer-events:none; text-align:left; padding:5px 5px">'+ plInf +'</pre>'
        + '</td></tr>');
    }

    setRowCol();

    tmp= row.nextSibling.firstChild.firstChild;
    if(+tmp.offsetHeight > 175)
      $(tmp).css({height:'175px'});
    else
    {
      var svgBtn= $(row.nextSibling.firstChild).find('.vsiz')[0];
      svgBtn.disabled= true;
    }

    $(row.nextSibling.firstChild).find
    tmp.scrollTop= tmp.scrollHeight;

    tmp= $(row.nextSibling)[0];
    setScroll(tmp);
  });
  //header
  $('#pth').click(function(e)
  {// *** table headers, do sort
    var os= tbSrt[1], s= e.target.cellIndex;
    s= (0 < os && Math.abs(os) -1 === s)? -(s+1) : s+1;
    sortem(1, s);

    reFresh();
  });


  $('#htb').click(function (e)
  { 
    var a, tmp, row, hid, tx;
    row= e.target.parentNode;
    if(row.rowIndex === undefined) row= e.target;
    var tx= row.rowIndex;

    if($(row).hasClass('selR')) {
      resetEdit(2, false); e.stopPropagation(); return; }

    resetEdit(2, false); 
    edtRow[2]= tx;

    hid= +$(row)[0].cells[0].innerText;

//      if(editMode)
    {
      var i, x, dtm,
          trt= 'trtInit', crmr= 'crmInit';

      $('#ta2sub').val('Edit Session');

      $('#t2e0').val( hid );

      dtm= +sdt2ndt(row.cells[1].innerText);
      a= ''+ dtm;

      $('#t2e1y').val( a.substr(0,4) );
      $('#t2e1m').val( a.substr(4,2) );
      $('#t2e1d').val( a.substr(6,2) );
      $('#t2e1h').val( a.substr(8,2) );

      for(i= 0; i < hiTab.length; i++)
      {
        x= hiTab[i];
        if(x[0] === hid)
        {
          $('#t2e2').val( x[3] );
          $('#t2e3').val( x[4] );
          break;
        }
      }

      $('#ta2rmv')[0].disabled= false;
      $('#ta2sub')[0].disabled= false;
    }
    rowAnim(tx, true);
  });
  //header
  $('#hth').click(function(e)
  {// *** table headers, do sort
    var os= tbSrt[2], s= e.target.cellIndex;
    s= (0 < os && Math.abs(os) -1 === s)? -(s+1) : s+1;
    sortem(2, s);

    reFresh();
  });


  // *** import... *********************************************
  function importDB(d)
  {
    localStorage.removeItem('ju');

    nextID= 0;
    nextHD= 0;

/*    adminInfo.innerText+= 'zip.len= '+ (d.length/1024).toFixed(2) +'KB \n';
    d= window.LZString.decompressFromEncodedURIComponent(d);
    adminInfo.innerText+= 'uzp.len= '+ (d.length/1024).toFixed(2) +'KB \n';
*/

    var nanCnt= 0;
    var a, i, r, tt,
        loP, loH, x= d.split('$');
    
    plTab.length= 0;
    loP= x[0].split('|');
    for(i= 0; i < loP.length; i++)
    {
      r= loP[i];
      tt= r.split('^');
      
      if(!tt[0] || isNaN(tt[0])
         || +tt[0] < 1) { nanCnt++; continue; }

      tt[0]= +tt[0]; 
      if(tt[0] >= nextID) nextID= tt[0]+1;

      plTab.push([ tt[0], tt[1], tt[2], tt[3], tt[4], tt[5] ]);
    }

    hiTab.length= 0;
    loH= x[1].split('|');
    for(i= 0; i < loH.length; i++)
    {
      r= loH[i];
      tt= r.split('^');

      if(isNaN(tt[0]) || isNaN(tt[1])) {
        nanCnt++; continue; }

      hiTab.push([ 0, +tt[0], +tt[1], tt[2], tt[3] ]);
    }
    
    sortem(curTab= 2, -2);
    for(i= 0; i < hiTab.length; i++)
    {
      hiTab[i][0]= i+1;
    }

    sortem(curTab= 2, 1);
    nextHD= hiTab.length+1;
    reFresh();
    
    sortem(curTab= 1, 2);

    $('#mtb1').click();
    reFresh();
    adminInfo.innerText+= 'NaNs count:'+ nanCnt+'\n';
  }


  function spaceLeft()
  {
    var j, i= 0, sz= 1024*10; //precission KBx10
    var data= ''+ new Array(sz).join('9');
    while(i <= 9*sz)
    {
      try { localStorage.setItem('tK'+ i++, data); }
      catch(e) { break; }
    }

    for(j= 0; j < i; j++)
      localStorage.removeItem('tK'+ j);

    return i*sz;
  }

  function locStorageInfo()
  {
    var r, u= JSON.stringify(localStorage).length;
    // ~~ double bitwise = Math.flor()
    u= (u /1024).toFixed(2);
    r= (spaceLeft() /1024).toFixed(2);
    adminInfo.innerText+= 'LOCAL STORAGE:usage info \n'
      +'Used: '+(u)+'KB \n'+ 'Left: '+(r)+'KB \n';

    cchInfo();
  }

  function loadCache(isImport)
  { 
    if(!window.localStorage) {
      adminInfo.innerText+= 'FAIL:window.localStorage \n'; return; }
    else
      adminInfo.innerText+= 'PASS:window.localStorage \n';
   

    adminInfo.innerText+= 'CACHE:info & import \n';
    locStorageInfo();

    var t, d= localStorage.getItem('dataBase');
    if(!d) { nBar.innerText= ' [!]No cache data'; return; }

    if(isImport)
    {
      //adminInfo.innerText+= 'zip.len= '+ (d.length/1024).toFixed(2) +'KB \n';
      //d= window.LZString.decompress(d);
      adminInfo.innerText+= 'uzp.len= '+ (d.length/1024).toFixed(2) +'KB \n';

      importDB(d); 
//      adminInfo.innerText+= 'import@loadCache-RAW:Pass!\n';
    }
//    else adminInfo.innerText+=  'info@loadCache-RAW:in progress.. \n';
  }

  function loadServer()
  {
    adminInfo.innerText+= '\nSERVER:load & import\n';
    $.ajax(
    {
      url:appPath +'/lod:'+dbPass, type:'GET',
      error:function(e, f)
      {
        adminInfo.innerText+= 'FAIL@client:'+ f +'\n';
        ttxt= 'CACHE'; loadCache(true);
        $("#mtb3").click();
      },
      success:function(d, s, x)
      {
        adminInfo.innerText+= x.getAllResponseHeaders()
          + 'PASS:server load '+ (d.length/1024).toFixed(2) +'KB \n';

        ttxt= ' Clients ';
      
        importDB(d);
      }
    });
  }


  function knockKnock()
  {
    adminInfo.innerText+= 'SERVER:knockKnock \n';
    $.ajax(
    {
      url:appPath +'/lgn:knock'+versionCode.substr(0,4), type:'GET',
      error:function(e, f)
      {
        adminInfo.innerText+= 'Knocking... \n';
      }
    });
  }

// *** FORMER logMe()
/*
    adminInfo.innerText+= 'SERVER:logme \n';
    $.ajax(
    {
      url:appPath +'/lgn:'+dbPass, type:'GET',
      error:function(e, f)
      {
        adminInfo.innerText+= 'FAIL@client:'+ f +'\n';
        
        if(dbPass !== 'knock')
          $("#log4But").val('Server Awakening:'+ f +', try again!');
      },
      success:function(r, s, x)
      {
        if(r !== 'OK')
        {
          if(dbPass === 'knock')
            adminInfo.innerText+= 'PASS@server:waking up \n';
          else {
            adminInfo.innerText+= 'FAIL@server:'+ r +'\n';
            $("#log4But").val('Wrong password, try again!'); }

          dbPass= '*';
          $('#pasIn').val('').focus();

          return;
        }
  
        adminInfo.innerText+= 
          x.getAllResponseHeaders() +'\n'+ 'PASS:accepted \n';

        loadDB();
      }
    });
*/


// *** NEW INTERCEP TO ATTEMPT ERROR FIX
  function logMe()
  {
    if(dbPass == 'knock') {
      knockKnock();
      return;
    }

    if(dbPass !== 'sal0n')
    {
      $("#log4But").val('Wrong password, try again!');
      return;
    }

    isLogged= true;
    ttxt= ' Clients ';

    $('#hmPage').css({display:'none'});
    $('#appFrame').css({display:'block'});
    
    var t, d= localStorage.getItem('dataBase');
    if(!d) {
      adminInfo.innerText+= ' [!]No cache data! \n'
      loadDB();
      return; 
    }

    adminInfo.innerText+= 'uzp.len= '+ (d.length/1024).toFixed(2) +'KB \n';

    importDB(d);

    $('#log4But').css({background:'none', 'box-shadow':'none'});
    $('#log4But').val("Logged"); $('#pasIn').css({display:'none'});

    adminInfo.innerText+= 'import@loadCache:PASS \n';    
  }
// *** NEW INTERCEP TO ATTEMPT ERROR FIX

  

  function saveDB(cchOnly)
  {
    // *** CACHE SAVE
    adminInfo.innerText+= 'CACHE:export & save \n';

    if(!window.localStorage) {
      adminInfo.innerText+= 'FAIL:window.localStorage \n'; return; }
    else
      adminInfo.innerText+= 'USING:window.localStorage \n';
 
    var d, rawdb, rwp, rwh,
        qq= [], xx= [], yy= [];
    
    plTab.forEach(function(r)
    { 
      xx.push( r.join('^') );
    });
    rwp= xx.join('|');

    hiTab.forEach(function(r)
    {
      qq= [ r[1], r[2], r[3], r[4] ];
      yy.push( qq.join('^') );
    });
    rwh= yy.join('|');
    
    rawdb= rwp +'$'+ rwh;

    d= rawdb.replace(/[^A-Z0-9.\-,\+ $#\|\^~]/gi, '');
    
//    adminInfo.innerText+= 'zip.len= '+ (d.length/1024).toFixed(2) +'KB \n';
  //    d= window.LZString.compress(d);
//    d= window.LZString.compressToEncodedURIComponent(d);
    adminInfo.innerText+= 'uzp.len= '+ (d.length/1024).toFixed(2) +'KB \n';

    localStorage.clear();
    localStorage.setItem('dataBase', d);

    nBar.innerText= ' [i]Cache save OK';
    adminInfo.innerText+= 'PASS:cache save '+ (d.length/1024).toFixed(2) +'KB \n';
    if(cchOnly) return;


    // *** SERVER SAVE
    adminInfo.innerText+= 'SERVER:export & save \n';

    if(!navigator.onLine) {
      adminInfo.innerText+= 'FAIL:navigator.online \n'; return; }
    else
    if(!isLogged) {
      adminInfo.innerText+= 'FAIL:no password\n';
      nBar.innerText= ' [!]Must be logged to update server database'; return; }

    $.ajax(
    {
      url:appPath +'/sav:'+dbPass, data:d, type:'POST',
      error:function(e, f)
      {
        adminInfo.innerText+= 'FAIL@client:'+ f +'\n';
      },
      success:function(r, s, x)
      {
        if(r.substring(0,4) !== 'P@sv') {
          adminInfo.innerText+= 'FAIL@server:'+ r +'\n'; return; }

        nBar.innerText= ' [i]Server save '+ r.substr(5);
        adminInfo.innerText+= x.getAllResponseHeaders() +'\n'
          + 'PASS:server save '+ (d.length/1024).toFixed(2) +'KB \n';
      }
    });
  }

  function loadDB()
  {
    if(!navigator.onLine)
    {
      adminInfo.innerText+= 'FAIL@navigator.offline \n';
      ttxt= 'OFFLINE';
      loadCache(true);
      $("#mtb3").click();
      return;
    }
    loadServer();
  }


  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // *** action starts here **********************************                    
  if(navigator.storage) {
    navigator.storage.persisted().then(function(getP) {
      if(getP) {
        $('#gpc4But').val("Persistance Granted");
        $('#gpc4But').css({background:'none', color:'black', 'box-shadow':'none'}); }
    });
  }

  clrAdmin();
  //*** WAKE UP SERVER
  dbPass= 'knock'; logMe();

  // *** tab buttons listener ********************************
  $(".mtb").click(function(e)
  {
    $(".mtb").removeClass("act dea").addClass("dea");
    $(this).removeClass("dea").addClass("act");

    $(".ptab").removeClass("pac pde").addClass("pde");
    var tid= "#tab"+ (this.id).substring(3,4);
    $(tid).removeClass("pde").addClass("pac");

    lastTab= curTab;
    $("#mnu1")[0].value= 'EDIT MODE';
    $("#help").css({display:'none'});
    $(adminInfo).css({height:'auto'});
    switch(tid)
    {
      case '#tab1': curTab= 1;

        if(lastTab === 2 && edtRow[2] >= 0) {
          fltNum[1]= 1; fi1Hdr[1]= '0#Id.'; fi1Mod[1]= 9;
          fi1Inp[1]= +$('#htb>tr')[edtRow[2]].cells[2].innerText;

//          resetEdit(1);
          reFresh();
          edtRow[1]= 0;
        }

        editMode= true;
        nBar.innerText= tblInf[curTab];
        break;

      case '#tab2': curTab= 2;
        if(lastTab === 1 && edtRow[1] >= 0)
        {
          fltNum[2]= 1; fi1Hdr[2]= fi2Hdr[2]= '2#Id.'; fi1Mod[2]= 9;
          fi1Inp[2]= +$('#ptb>tr')[edtRow[1]].cells[0].innerText;

          resetEdit(2);
          reFresh();
        }

        nBar.innerText= tblInf[curTab];
      break;

      case '#tab3': curTab= 3;
        $("#mnu1")[0].value= 'HELP';
        nBar.innerText=' [i]System';
      break;
    }

//    if(curTab === 2) { editMode= false; $("#mnu1").click(); }    else
    if(editMode) $("#mnu1").click();
  });

  // *** BUTTONS #################################################
  $('.ord2').click( function() { clrAdmin(); });
  $('#headbar').click(function() {
    var t= nBar.innerText; nBar.innerText= lastNotif; lastNotif= t;  });
  $('.mnu, .mtb, .ord, .ord2, .ord3').click(function(e) { e.stopPropagation(); });

  $("#mnu1").click(function()
  { // star A.
    if(curTab === 3)
    {
      clrAdmin();
      $(adminInfo).css({height:'auto'});
      $("#help").css({display:'block'});
      adminInfo.innerText+= ' [i][#][@][?][!].. \n';
      nBar.innerText= ' [i]Design & Coding by Zele - Belgrade, Aug`2018. ze_aks@hotmail.com';
      return;
    }
//    sRs= $('#ptb')[0].getElementsByClassName('selR');

    resetMerge();

    var js= '#htb>tr', tl= hiTab.length;
    if(curTab !== 2) { js= '#ptb>tr'; tl= plTab.length; }
    
    var er= edtRow[curTab];
    resetEdit(curTab);
    if(editMode= !editMode)
    {
      this.value= 'FIND MODE';
      $(".admin").css({display:'table-cell'});
      $('.adminEdit').css({display:'inline-block'});
      $('.filt').css({display:'none'});
    }
    else
    {
      this.value= 'EDIT MODE';
      $(".admin").css({display:'none'});
      $('.adminEdit').css({display:'none'});
      $('.filt').css({display:'block'});
    }

    if(er >= 0 && er < tl )
    {
      var jj= $(js)[er];
      $(jj.firstChild).click();
    }

    resetVsize();
    nBar.innerText= tblInf[curTab];
  });

  // *** FILTERING ************************************
  function hntShow() {
    nBar.innerText= tblInf[curTab] +' [i]Press ESC to toggle filter modes'; }


  $('#t1fil, #t2fil').click(function(e)
  {//e.stopImmediatePropagation(); e.preventDefault();
    var fn, i, tn= curTab;

    fn= ++fltNum[tn];
    i= Math.abs(tbSrt[tn])-1;

    if(tn !== 2)
    {
      tn= 1;
      i= $('#t1F').val();
    }
    else
      i= $('#t2F').val();

      if(fn === 2) fi2Inp[tn]= i
      else fi1Inp[tn]= i;

    reFresh();
  });

  $('#t1clr, #t2clr').click(function(e)
  { //e.stopImmediatePropagation(); e.preventDefault();

    var js= '#t2F', tn= +this.id[1];
    if(tn !== 2) { tn= 1; js= '#t1F'; }

    fltNum[tn]= 0;
    resetEdit(tn);

    if(tn !== 2)
    {
      sortem(1, 2);

      $('#mtb1').click();
      reFresh();
    }
    else
    {
      sortem(2, 1);

      $('#mtb2').click();
      reFresh();
    }

//    $(js).focus();
  });

  $('#t1F, #t2F').on('blur', function(e) { tiFresh(); });

  $('#t1F, #t2F').on('focus', function(e)
  {
    var i= +this.id[1]; if(i !== 2) i= 1;
    this.select();
    
      if(fltNum[i] === 0)
        fi1Mod[i]= 1;
      else
        fi2Mod[i]= 1;

    tiFresh(1);
    hntShow();
  });

  // *** INPUT TEXT FIELD ...............................
  $('#t1F, #t2F').on('keyup', function(e)
  {
    var a, t= this.value, tn= +this.id[1];
    if(tn !== 2) tn= 1;

    if(t.length === 0) hntShow();
    if(e.which === 27) //t.length === 0 && 
    {
      e.stopImmediatePropagation(); e.preventDefault();

      if(fltNum[tn] === 0)
        fi1Mod[tn]= (fi1Mod[tn] !== 1)? 1:2;
      else
        fi2Mod[tn]= (fi2Mod[tn] !== 1)? 1:2;

      tiFresh(1);
//      hntShow();
  //    this.value= '';
      nBar.innerrTexy= 'fi1Mod='+fi1Mod[tn];
      return;
    }  
//    else    if(t.length === 1)      nBar.innerText= tblInf[tn];

    a= Math.abs(tbSrt[tn]) -1;
    if(tn !== 2)
    { // *** tab1
      t= t.toUpperCase();
      if(a === 0)
        this.value= t.replace(/[^0-9 N]/g, '');
      else
      if(a < 3)
        this.value= t.replace(/[^A-Z \-]/gi, '');
      else
        this.value= t.replace(/[^0-9 \-#N]/gi, '');
      return;
    }

    // *** tab2
    t= t.toLowerCase();
    if(a > 2)
      this.value= t.replace(/[^A-Z 0-9\+,\-.]/gi, '');
    else
      this.value= t.replace(/[^0-9 a]/gi, '');
  });

  $('.finf').on('keydown', function(e)
  {
    if(e.which !== 9 && e.which !== 13) return;
    $(this).next().click();
  });

// *** &&...
  $('.clPinf').on('keyup', function()
  {
    var ii, tv, tn= curTab;
    if(this.id.length < 4) ii= -1;
    else ii= +this.id[3];

    tv= ''+this.value;
    tv= tv.toUpperCase();
     // *** tab1
    if(ii === 0)
      this.value= tv.replace(/[^0-9]/g, '');
    else
    if(ii < 3)
      this.value= tv.replace(/[^A-Z \-]/gi, '');
    else
    if(ii > 2)
      this.value= tv.replace(/[^0-9]/g, '');

    $('#ta1mrg')[0].disabled= true;
    $('#ta1rmv')[0].disabled= true;
    $('#ta1sub')[0].disabled= false;
    return;
  });

  $('.clPinf2').on('keyup', function()
  {
    var ii= +this.id[3], tv, tn= curTab;

    if(ii !== 1) ii= 0;

    tv=  this.value.toLowerCase();
    // *** tab2
      if(ii === 1)
        this.value= tv.replace(/[^0-9]/g, '');
      else
        this.value= tv.replace(/[^a-z 0-9\+.\-,]/gi, '');

    $('#ta2rmv')[0].disabled= true;
    $('#ta2sub')[0].disabled= false;
  });


  // *** TAB 1 : ADMIN BUTTONS **********************************
  $('#ta1rmv').click( //>Remove<
  function()
  {
    if(!confirm('Selected client will be '
      +'completely removed from the files.\n\nAre you sure?')) return;

    var i, x, fnd= -1,
        cid= $('#t1e0')[0].value;
    for(i= 0; i < plTab.length; i++)
    {
      x= plTab[i];
      if(x[0] === +cid) { fnd= i; break; }
    }

    if(fnd >= 0)
    {
      plTab.splice(fnd, 1);

      resetEdit(1);
      reFresh();
      $('#mtb1').click();
      
      nBar.innerText= ' [i]Deleted';
    }
    else
      nBar.innerText= ' [!]Not found';
  });

  $('#ta2rmv').click( //>Remove<
  function()
  {
    if(!confirm('Selected session will be '
      +'completely removed from the files.\n\nAre you sure?')) return;

    var i, x, fnd= 0,
        hid= +$('#t2e0')[0].value;

    for(i= 0; i < hiTab.length; i++)
    {
      x= hiTab[i];
      if(x[0] === hid) { fnd= i; break; }
    }

    if(fnd >= 0)
    {
      hiTab.splice(i, 1);
      
      resetEdit(2);
      reFresh();
      $('#mtb2').click();
      
      nBar.innerText= ' [i]Deleted';
    }
    else
      nBar.innerText= ' [!]Not found';
  });

  $("#ta1sub").click(function()
  {
    var i, cid;
    if(this.value[0] === 'N')
    { // *** NEW CLIENT
      $('#ta1sub').val('Confirm New');
      $('.clPinf').css({display:'inline'});

      $('#ta1sub')[0].disabled= true;
      $('#t1e0').val( nextID );
      $('#t1e1').focus();
    }
    else
    if(this.value[0] === 'C')
    { // *** CONFIRM NEW
      cid= nextID++;
      plTab.push([ cid,
                  formatSession($('#t1e1')[0].value, '~'),
                  formatSession($('#t1e2')[0].value, '~'),
                  formatSession($('#t1e3')[0].value, '~'),
                  formatSession($('#t1e4')[0].value, '~'),
                  '' ]);

      fltNum[1]= 1;
      fi1Hdr[1]= fi2Hdr[1]= '0#Id.';
      fi1Mod[1]= 9; fi1Inp[1]= cid;

      reFresh();
      fltNum[1]= 0;
      
      edtRow[1]= 0;
      $('#mtb1').click();
      $('#t1fil')[0].disabled= true;
    }
    else
    if(this.value[0] === 'E')
    { // *** EDIT CLIENT
      $('#ta1sub').val('Apply Edit');
      $('#ta1mrg')[0].disabled= true;
      $('#ta1rmv')[0].disabled= true;
      $('#ta1sub')[0].disabled= true;

      $('.clPinf').css({display:'inline'});
      $('#t1e1').focus();
    }
    else
    if(this.value[0] === 'A')
    { // *** APPLY EDIT
      cid= +$('#t1e0')[0].value;
      for(i=0; i < plTab.length; i++)
      {
        if(plTab[i][0] === cid)
        {
          plTab[i][1]= formatSession($('#t1e1')[0].value, '~');
          plTab[i][2]= formatSession($('#t1e2')[0].value, '~');
          plTab[i][3]= formatSession($('#t1e3')[0].value, '~');
          plTab[i][4]= formatSession($('#t1e4')[0].value, '~');
        }
      }

      fltNum[1]= 1;
      fi1Hdr[1]= fi2Hdr[1]= '0#Id.';
      fi1Mod[1]= 9; fi1Inp[1]= cid;

      reFresh();
      edtRow[1]= 0;

      $('#mtb1').click();
      $('#t1fil')[0].disabled= true;
    }
  });

  $("#ta2sub").click(function()
  {
    var i, x, cid, hid, dtm;

    if(this.value[0] === 'E')
    { // *** EDIT SESSION
      $(this).val('Apply Edit');
      $('#ta2rmv')[0].disabled= true;
      $('#ta2sub')[0].disabled= true;

      $('#t2e1y')[0].disabled= false;
      $('#t2e1m')[0].disabled= false;
      $('#t2e1d')[0].disabled= false;
      $('#t2e1h')[0].disabled= false;

      $('#t2e2')[0].disabled= false;
      $('#t2e3')[0].disabled= false;

      $('#t2e2').focus();
    }
    else
    if(this.value[0] === 'A')
    { // *** APPLY EDIT
      $(this).val('Edit Session');

      hid= +$('#t2e0')[0].value;
      for(i= 0; i < hiTab.length; i++)
      {
        x= hiTab[i];
        if(x[0] === hid)
        { //nBar.innerText= 'Apply @'+ x[0] +':'+ x[1] +' '+ x[2];
          cid= +x[2];
          x[3]= formatSession($('#t2e2')[0].value);
          x[4]= formatSession($('#t2e3')[0].value);

          dtm= ('2018'+ $('#t2e1y')[0].value).slice(-4) + ('00'+ $('#t2e1m')[0].value).slice(-2)
            + ('00'+ $('#t2e1d')[0].value).slice(-2) + ('00'+ $('#t2e1h')[0].value).slice(-2);

          x[1]= +dtm;
          break;
        }
      }

      reFresh();
      $('#mtb2').click();
      $('#t2fil')[0].disabled= true;
    }
  });

  var mergMaster= 0;
  function resetMerge()
  {
    mergMaster= 0;
    mergMode= false;

    $('#tmpX, #tmpD').remove();
    $('#ta1mrg').val('Merge');
    $("#mnu1").val('FIND MODE');
  }

  $("#ta1mrg").click(function() { //>Merge<

    if(mergMode= !mergMode)
    {
      var jq= $('#ptb>tr.selR')[0];
      var xc= 'ORIGINAL: '+ jq.innerText;

      mergMaster= +jq.cells[0].innerText;
      $(this.parentNode)
        .before('<p id="tmpX" style="background:black; color:white; '
        +'padding:5px 9px; overflow:hidden; text-overflow:ellipsis; '
        +'white-space:nowrap; font-size:17px">'+ xc +'</p>');

//      resetEdit(1);
      $(this).val('Apply Merge');
      $("#mnu1").val('CANCEL MERGE');
      $('#ta1mrg')[0].disabled= true;
      $('#ta1rmv')[0].disabled= true;
      $('#ta1sub')[0].disabled= true;
      
      setScroll($('#ptb>tr.xtrR')[0]);
    }
    else
    {
      if(!confirm('Last selected client "duplicate" will be removed '
        +'from the files and their session history merged with the first '
        +'selected "original" client`s records.\n\nAre you sure?'))
      {
        resetEdit(1);
        resetMerge();
        return;
      }

      var i, x, cid, fnd= -1;
      cid= +$('#t1e0')[0].value;
      // merge with master
      for(i= 0; i < hiTab.length; i++)
      {
        x= hiTab[i];
        if(x[2] === cid) x[2]= mergMaster;
      }

      // remove duplicat
      for(i= 0; i < plTab.length; i++)
      {
        x= plTab[i];
        if(x[0] === cid) { fnd= i; break; }
      }

      if(fnd >= 0)
      {
        plTab.splice(fnd, 1);

//        resetEdit(1);

        nBar.innerText= ' [i]Deleted';
      }
      else
        nBar.innerText= ' [!]Not found';


      fltNum[1]= 1;
      fi1Hdr[1]= fi2Hdr[1]= '0#Id.';
      fi1Mod[1]= 9; fi1Inp[1]= mergMaster;

      reFresh();
      edtRow[1]= 0;

      resetMerge();

      $('#mtb1').click();
      $('#t1fil')[0].disabled= true;
    }
  });

  $('#t1all, #t2all').click(function(e)
  {//    nBar.innerText= ' [!]Please wait...'; nBar.focus();
    alert('This may take more than a few seconds!');
    tbAll[curTab]= 0; reFresh();
  });

  // *** TAB 3 : ADMIN BUTTONS ***************************************
  $('#showPass').click(function() { //img>Show Password});
    $('.hom').css({display:'none'});
    $('#hmLog').css({display:'block'});
    window.scrollTo(0, 999);
    
//    $('#pasIn').css({display:'none'});
  });

  $("#log4But").click(function() { //>Log In<
//    if(isLogged) return;
    dbPass= $('#pasIn').val();
    $("#log4But").val('Please wait...');

    setTimeout(function() { logMe(); }, 99);
  });
  
  // *** class="ord2" : DARK BOTTOM BUTTON
  $("#cad4But").click( function() { // >Cache Data<
    loadCache(false);
  });
  $("#imc4But").click( function() { // >Import Cache<
    ttxt= 'IMPORT'; loadCache(true);
  });
  $("#stc4But").click( function() { // >Store Cache<
   saveDB(true);
  });

  $("#gpc4But").click(function()
  { //>Grant Persistence<

    if(!navigator.storage) {
      adminInfo.innerText+= 'No navigator.storage! \n'; return; }
    if(!navigator.storage.persist) {
      adminInfo.innerText+= 'No navigator.storage.persist! \n'; return; }

    navigator.storage.persisted().then(function(getP)
    {
      if(getP) adminInfo.innerText+= "Storage persistence already granted! \n";
      else
      {
        navigator.storage.persist().then(function(setP)
        {
          if(setP)
          {
            adminInfo.innerText+= "Storage persistence is now granted! \n";
            $('#gpc4But').val("Persistance Granted");
            $('#gpc4But').css({background:'none', color:'black', 'box-shadow':'none'});
          }
          else
          {
            adminInfo.innerText+= 'Storage persistence denied, \n'
                                + 'try again after enabing notifications! \n';
            if(!Notification)
              adminInfo.innerText+= 'Notifications unavailable, try Chromium! \n';
            else
              Notification.requestPermission();
          }
        });
      }
    });
  });

  function cchInfo()
  { //    adminInfo.innerText+= "Cache info.v9 -- \n";
    var t= ':window.caches \n';
    if(window.caches)
    {
      adminInfo.innerText+= 'PASS' +t;
      caches.keys().then(function(cacheNames)
      {
        cacheNames.forEach(function(cacheName)
        {
          caches.open(cacheName).then(function(cache)
          {
            return cache.keys(); 
          }).then(function(reqs)
          {
              var strOut= 'Cache data files: \n';
              reqs.forEach(function(rs, i)
              {
                strOut+= '            '+ ('   '+ (i+1)).slice(-3) +':: '
                  + (rs.url).substr(0+ (rs.url).lastIndexOf('/')) +'\n';
              });
              adminInfo.innerText+= 'Cache name: '+ cacheName +' \n'+ strOut +'\n';
              strOut= '';
          });
        });
      });
    }
    else adminInfo.innerText+= 'FAIL' +t;
    
    t= ':navigator.storage \n';
    if(navigator.storage)
    {
      adminInfo.innerText+= 'PASS' +t;
      t= ':navigator.storage.estimate \n';
      if(navigator.storage.estimate)
      {
        adminInfo.innerText+= 'PASS' +t;
        navigator.storage.estimate().then(function(est)
        {
          adminInfo.innerText+= 'WINDOW CACHES:usage info \n'
            +'Used: '+ (est.usage/1048576).toFixed(2) +'MB \n'
            +'Left: '+ (est.quota/1048576).toFixed(2) +"MB \n";
        });
      }
      else adminInfo.innerText+= 'FAIL' +t;

      t= ':navigator.storage.persist \n';
      if(navigator.storage.persist)
      {
        adminInfo.innerText+= 'PASS' +t;
        navigator.storage.persisted().then(function(getP) {
          adminInfo.innerText+= "Persistence: "+ getP +'\n'; });
      }
      else adminInfo.innerText+= 'FAIL' +t;
    }
    else adminInfo.innerText+= 'FAIL' +t;

    t= ':navigator.serviceWorker \n';
    if(navigator.serviceWorker) adminInfo.innerText+= 'PASS' +t;
    else adminInfo.innerText+= 'FAIL' +t;

    adminInfo.innerText+= '\n';
  }

  $("#med4But").click( function()
  {
    localStorage.clear();
    adminInfo.innerText+= 'Local storage cleared. \n';
  });

  $("#sld4But").click( function() { loadDB(); }); //>Server Load<
  $("#ssv4But").click( function() { saveDB(); }); //>Server Save<

}); // THE ENDs
