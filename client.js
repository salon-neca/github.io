$(document).ready(function()
{
  var versionCode= 'v0.08c \n';
  var appPath= 'https://sns.glitch.me';
  $.ajaxSetup({async:true, cache:false, timeout:9999});
  
  var nBar= document.getElementById('notif');
  var adminInfo= document.getElementById('dbFrame');

  var nextID= 0;

  var dbPass= '*';
  var isLogged= false;
  var ttxt= 'Loading...';

  var curTab= 1;
  var lastTab= 0;
  var editRow= -1;
  var editMode= false;

  var tbSpc= [0, '40px','40px','300px'];
  var tbLst= [0, 1,1];
  var tbSrt= [0, 2,-1];
  var tbFcol= [0, 0,0];
  var tbFmod= [0, 0,0];
  var tblInf= [0, '~tI1','~tI2'];
  var fltInf= [0, '~fI1','~fI2'];
  
  var recNum= [0, 0,0];
  var fltNum= [0, 1,1];
  var fltMax= [0, 0,0];
  var fltInp= [0, '',''];
  var fltStr= [0, '~fS1','~fS2'];

// *** PLAYER TAB
  var plTab= [0, 'first', 'last', 'tel', 'mob', '[memo]'];
  var plShw= [0, 'first', 'last', 'tel', 'mob', '[memo]'];
// *** HISYORY TAB TABLE
  var hiTab= [0, 0, 'info'];
  var hiShw= [0, 0, 'info'];

  var lastNotif= '';
  function clrAdmin(a)
  {
    if(!a) adminInfo.innerText= versionCode;
    if(nBar.innerText !== '...') {
      lastNotif= nBar.innerText; nBar.innerText= '...'; }
  }

  function setRowCol(ct)
  {
    if(!ct) ct= curTab;
    switch(ct)
    {
      case 1:
        $('#ptb>tr').css({border:'none'});
        $('#ptb>tr').not('.selR, .xtrR').removeClass().addClass("clnR");

        $('#ptb>tr.xtrR').css({background:'#1f1f1f'});
        $('#ptb>tr.xtrR').find('pre').css({color:'white', background:'black', 'font-weight':'normal'});
        switch(tbLst[ct])
        {
          case 1:
            $('#ptb>tr').not('.selR, .xtrR').removeClass('clnR');
          break;

          case 2:
            $('#ptb>tr').css({'border-top':'1px solid lightgrey'});
            $('#ptb>tr.xtrR').css({background:'lightgrey'});
            $('#ptb>tr.xtrR').find('pre').css({color:'black', background:'white'});
          break;

          case 3:
            $('#ptb>tr.xtrR').css({background:'black'});
            $('#ptb>tr.xtrR').find('pre').css({color:'lightgrey', background:'#202020', 'font-weight':'bold'});
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

  function rowAnim(ri, turnOn)
  {
    var row= $('#htb>tr')[ri-1];
    if(curTab === 1) row= $('#ptb>tr')[ri-1];
    
    var xi= tblInf[2], xx= hiShw[ri-1][1];
    if(curTab === 1) { xi= tblInf[1]; xx= plShw[ri-1][0]; }
    
    if(!turnOn)
    {
      $(row).removeClass();
      if(tbLst[curTab] !== 1) $(row).addClass('clnR');
      nBar.innerText= xi;
      return;
    }

    $(row).removeClass('clnR').addClass('selR');
    var cid= $(row)[0].firstChild.innerText;
    nBar.innerText= xi + ' @'+ cid +':'+ cid2nme(+cid);
  }

  function resetEdit(tab, jin)
  {
    editRow= -1;
    if(!tab) tab= 1;
    if(tab === 2)
    {
      if(jin) return;
      $('#htb>tr.xtrR').remove();
      $('#htb>tr').removeClass();
      if(tbLst[2] !== 1) $('#htb>tr').addClass('clnR');
      return;
    }

//    $('#ta1mrg')[0].disabled= true;
  //  $('#ta1rmv')[0].disabled= true;

    $('#t1e0').val( nextID+1 );
    $('#ta1sub').val('New Client');
    $('#t1e1').val(''); $('#t1e2').val('');
    $('#t1e3').val(''); $('#t1e4').val('');

    if(jin) return;
    $('#ptb>tr.xtrR').remove(); 
    $('#ptb>tr').removeClass();
    if(tbLst[1] !== 1) $('#ptb>tr').addClass('clnR');
  }

  function sortem(tab, col)
  {
    tbSrt[tab]= col;
    var rev= (col < 0);
    col= Math.abs(col)-1;

    var t= plShw;
    if(tab === 2) t= hiShw;
    if(tab === 0) t= plTab;
    if(tab === 3) t= hiTab;
    if(t.length < 2) return;

    // alpha... works for numbers too, sure?
    t.sort(function(a, b)
    {
      if(b[col] > a[col]) return -1;
      else if(b[col] < a[col]) return 1;
      else return 0;
    });

    if(rev) t.reverse();
    if(tab === 1)
    { // *** header
      $('#pth>tr').children().css({border:'none'});
      $("#pth>tr").children().eq(col).css({border:'2px solid grey'});
      
      $('#t1in1').val('');
      if(col < 3) {
        $('#t1in1').attr({placeholder:'NAME'}); tbFcol[1]= 1; }
      else {
        $('#t1in1').attr({placeholder:'PHONE'}); tbFcol[1]= 2; }
    }
    else
    if(tab === 2)
    { // *** header
      $('#hth>tr').children().css({border:'none'});
      $('#hth>tr').children().eq(col).css({'border':'2px solid grey'});
    }
  }

  // ____________________________________________________________________
  // *** tabs# redraw... ************************************************
  function freshTab1()
  {
// *** ------------------------------------------------------------------------------
// *** !!!  !!!  !!!  !!!  !!!  !!!  !!!  !!!  !!!  !!!  !!!  !!!  !!!  !!!  !!!  !!
// *** - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// *** nextID: at initDB(), but needed for [new-client[, [remove] & [merge] too..
// *** ..not for [edit] tho, or is it?
// *** ------------------------------------------------------------------------------
//    nextID= 0;
    $("#ptb").empty();
    var i, ml= Math.min(99, plShw.length);
    for(i= 0; i < ml; i++)
    {
      var col= plShw[i];
      $('#ptb').append( '<tr tabindex="1">'
                        +'<td class="admin">'+ col[0]
                        +'</td><td>'+ col[1]
                        +'</td><td>'+ col[2]
                        +'</td><td>'+ col[3]
                        +'</td><td>'+ col[4]
                        +'</td></tr>' );
    }
    recNum[1]= i;
  }

  var msa= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
                          'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  function ndt2sdt(nd)
  {
    var m= +(''+nd).substring(4,6);
    return (''+nd).substring(6,8)+" " + msa[m-1]+"`"+(''+nd).substring(2,4);
  }

  function freshTab2()
  {
    $('#htb').empty();
    var i, ml= Math.min(99, hiShw.length);
    for(i= 0; i < ml; i++)
    {
      var col= hiShw[i];
      $('#htb').append( '<tr tabindex="1">'
                       +'<td>'+ ndt2sdt(col[0])
                       +'</td><td style="text-align:right">'+ col[1]
                       +'</td><td >'+ col[2]
                       +'</td></tr>');
    }
    recNum[2]= i;
  }

  function tiFresh(t)
  {
    var cln= false, jq= $('#t2inf');
    if(t < 0) { t*= -1; cln= true; }
    if(!t || t === 1) { t= 1; jq= $('#t1inf'); }

    if(cln)
    {
      if(fltNum[t] === 1) fltStr[t]= 'No Filters..';
      jq.text(fltStr[t]);
    }
    else
    {
      if(fltNum[t] === 1) fltStr[t]= '';
      var fc= (tbFcol[t] === 1)? 'NAME' : 'PHONE';
      var fm= (tbFmod[t] === 1)? '<begins with>' : '<contains>';
      fltInf[t]= ''+fltNum[t]+'.'+ fc + fm +'"..'; jq.text(fltStr[t] + fltInf[t]);
    }
  }

  function reFresh()
  {
    var i= curTab, j1, j2, a, b, c;
    $('#mtb1').val(ttxt);
    switch(curTab)
    {
      case 1: freshTab1();
        j1= $('#t1fil'), j2= $('#t1in1');
        a= recNum[i]; b= plShw.length; c= plTab.length;
      break;
      case 2: freshTab2();
        j1= $('#t2fil'), j2= $('#t2in1');
        a= recNum[i]; b= hiShw.length; c= hiTab.length;
      break;
    }
    
    setRowSpc(); setRowCol();
    nBar.innerText= tblInf[i]= ' [#]'+ a +'/'+ b +'('+ c +')';
    
        if(fltNum[i] === 1)
        {
          j1[0].disabled= false;
          j2[0].disabled= false;
          fltMax[i]= c;
        }

        if(b < fltMax[i] && fltNum[i] < 3)
        {
          fltMax[i]= b;
          if(fltNum[i]++ === 2)
          {
            j1[0].disabled= true;
            j2[0].disabled= true;
          }
          fltStr[i]+= fltInf[i].slice(0,-2) + fltInp[i] +'"  ';
        }

        j2.val('');
        tiFresh(-i);


// whats this for?
    if(editMode) $(".admin").css("display", "table-cell");
    else $(".admin").css("display", "none");

    lastTab= curTab;
  }
  // *** END REFRESH *****************************************

  
  function cid2nme(c,a)
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
    var n= 0, cs= '';
    for(var i= 0; i < hiTab.length; i++)
    {
      var q, x= hiTab[i];
      if(x[1] === rx)
      {
        n++;
        x[2]= x[2].replace(/\n|\r/g, ' ');
        var nc= 63, cl= x[2].length, ch= [];
        for(var j= 0; j < cl; j+= nc)
        {
          q= x[2].substring(j, j+nc);
          if(q[0] === ' ') q= q.substr(1);
          ch.push( q );
        }
        
        var ns= '#'+ ('0'+n).slice(-2) +'. ';

        ch= ch.join('\n            ');
        var p= ns +'DATE:  '+ ndt2sdt(x[0]) +'\nTREATMENT:  ' +ch;
        cs+= p +'\n   CREAMS:  '+'\n\n'; //          '     :
      }
    }

    return cs; //.slice(0,-2);
  }

  function id2mmo(c)
  {
    for(var i= 0; i < plTab.length; i++)
    {
      if(plTab[i][0] === c) return plTab[i][5];
    }
    return '~notFound@'+ c;
  }
  
  // *** subRow-content - REMOVE
  function subrowDelete(etpn)
  {
    rowAnim(etpn.previousSibling.rowIndex, false);
    $(etpn).remove();
    resetEdit(curTab, 1);
  }

  $('#playerTable').click(function(e)
  {
    var etpn= e.target.parentNode;
    if(etpn.rowIndex === undefined) etpn= e.target;
    var trx= etpn.rowIndex;

    if($(e.target).hasClass('ord3')) {
      var cid= etpn.parentNode.parentNode
                     .previousSibling.firstChild.innerText;
      nBar.innerText= ' @'+ cid +':'+ cid2nme(+cid); return;
    }

    if(trx === 0)
    {
      var os= tbSrt[1], s= e.target.cellIndex;
      s= (0 < os && Math.abs(os) -1 === s)? -(s+1) : s+1;
      sortem(1, s);

      reFresh();
      return;
    }

    if($(etpn).hasClass('xtrR')) {
      subrowDelete( etpn ); return; }
    
    if($(etpn).hasClass('selR')) {
      subrowDelete(etpn.nextSibling); return; }

    
    // *** subRow-content - CREATE
    if(editMode)
    {
      resetEdit(1)
      var t= editRow= trx-1;
      $('#ta1sub').val('Apply Edit');
      $('#t1e0').val( plShw[t][0] );
      $('#t1e1').val( plShw[t][1] );
      $('#t1e2').val( plShw[t][2] );
      $('#t1e3').val( plShw[t][3] );
      $('#t1e4').val( plShw[t][4] );

//      $('#ta1sub')[0].disabled= false;
//      $('.finf').attr({disabled:false});
/*
      $('#t1e0')[0].disabled= false;
      $('#t1e1')[0].disabled= false;
      $('#t1e2')[0].disabled= false;
      $('#t1e3')[0].disabled= false;
      $('#t1e4')[0].disabled= false;
*/
    }

    var q= etpn.firstChild.innerText;
    var mm= id2mmo(+q);
    
    var gu, nc= 63, cl= mm.length, ch= [];
    for(var j= 0; j < cl; j+= nc)
    {
      gu= mm.substring(j, j+nc);
      if(gu[0] === ' ') gu= gu.substr(1);
      ch.push( gu );
    }
    ch= ch.join('\n            ');
    gu= id2trs(+q) +'\n**** MEMO:  '+ ch +'\n\n';
    
//'CLIENT #ID: '+ q+ ':'+ cid2nme(+q) :
    var cols= editMode? 5:4;

    rowAnim(etpn.rowIndex, true);
    $(etpn).after(
        '<tr class="xtrR"><td colspan='+cols+'>'
      + '<pre style="padding:9px 9px; margin:3px 0 0 0; text-align:left; border:1px dashed grey; '
      + 'user-select: none; pointer-events:none; font-size:14px">'
      + gu +'</pre>'
      + '<button class="ord3" style="float:right" >New Session</button>'
      + '<button class="ord3" style="float:right" >Edit Memo</button>'
      + '</td></tr>');
    setRowCol();
    var z= $(etpn.nextSibling);
    if(z[0].getBoundingClientRect().bottom > window.innerHeight)
      z[0].scrollIntoView(false); // document.documentElement.scrollTop+= h;
  });

  $('#historyTable').on('click', function (e)
  { 
    var etpn= e.target.parentNode;
    if(etpn.rowIndex === undefined) etpn= e.target;
    var trx= etpn.rowIndex;

    if(trx === 0)
    {
      var os= tbSrt[2], s= e.target.cellIndex;
      s= (0 < os && Math.abs(os) -1 === s)? -(s+1) : s+1;
      sortem(2, s);
      
      reFresh();
      return;
    }
    
    if($(etpn).hasClass('selR')) rowAnim(trx, false);
    else 
    {
//      $('#htb>tr').removeClass('selR');
      rowAnim(trx, true); //alert(hiTab[trx-1][2]);
    }
  });
  
  // *** import... **************************************************
  function importDB(d)
  { // *** UNPACK & IMPORT
    var dl= d.split('\n');
    plTab.length= 0;
    plShw.length= 0;
    dl.forEach(function(x)
    {
      var k= x.split('\t');
      k[0]= +k[0];

      k[1]= k[1].toUpperCase();
      k[2]= k[2].toUpperCase();


      if(k[3][3] === '-') k[3]= k[3].replace('-', '');
      if(k[4][3] === '-') k[4]= k[4].replace('-', '');
        
      k[3]= k[3].replace('ili', ';');
      k[4]= k[4].replace('ili', ';');
      k[3]= k[3].replace(/[^\d,:/\\.;-]/g, '');
      k[4]= k[4].replace(/[^\d,:/\\.;-]/g, '');
      k[3]= k[3].replace(/[,:/\\.;]/g, '#');
      k[4]= k[4].replace(/[,:/\\.;]/g, '#');

      if(k[3][3] === '#') k[3]= k[3].replace('#', '');
      if(k[4][3] === '#') k[4]= k[4].replace('#', '');
      
      if((k[3].substr(0,5)).indexOf('#') >= 0) k[3]= k[3].replace('#', '');
      if((k[4].substr(0,5)).indexOf('#') >= 0) k[4]= k[4].replace('#', '');

      if((k[3].substr(0,5)).indexOf('-') >= 0) k[3]= k[3].replace('-', '');
      if((k[4].substr(0,5)).indexOf('-') >= 0) k[4]= k[4].replace('-', '');

      if((k[3].substr(0,8)).indexOf('-') >= 0) k[3]= k[3].replace('-', '');
      if((k[4].substr(0,8)).indexOf('-') >= 0) k[4]= k[4].replace('-', '');


      if(k[3].length > 5 && k[3].length < 8) k[3]= '011'+ k[3];
      if(k[4].length > 5 && k[4].length < 8) k[4]= '011'+ k[4];

      if(k[3].length < 10 &&  k[3][0] !== '0') k[3]= '0'+ k[3];
      if(k[4].length < 10 &&  k[4][0] !== '0') k[4]= '0'+ k[4];

      k[3]= k[3].replace(/[#]/g, ' #');
      k[4]= k[4].replace(/[#]/g, ' #');
// ***

      if(k[1].length < 2) k[1]= '~first';
      if(k[2].length < 2) k[2]= '~last';
      if(k[3].length < 5) k[3]= '~tel.';
      if(k[4].length < 5) k[4]= '~mob.';

      k[3]= k[3].toLowerCase();
      k[4]= k[4].toLowerCase();

      var ts= id2trs(k[0]);
      if(ts.length > 2)
      {
        plTab.push([ k[0],k[1],k[2],k[3],k[4], '~memoT..' ]);
        plShw.push([ k[0],k[1],k[2],k[3],k[4], '~memoS..' ]);
      }
    });

    sortem(0, -1); nextID= +plTab[0][0];
    sortem(curTab= 1, 2); reFresh();
    $('#mtb1').click();
  }


  function importDB2(d)
  {
    var dl= d.split('\n');
    hiTab.length= 0;
    hiShw.length= 0;
    dl.forEach(function(x, c)
    {
      var k= x.split('\t');

      k[0]= k[0].replace(/[-]/g, '');
      if(k[0].length < 3 || isNaN(k[0])) k[0]= '~date';
      else k[0]= +k[0];

      k[1]= +k[1];
      if(k[2].length < 3) k[2]= '#';

//      k[0]= k[0].substr(0,10);
  //    k[2]= k[2].substr(0,200);
      k[2]= k[2].toLowerCase();
      
      if(k[2] !== '#')
      {
        hiTab.push([ k[0], k[1], k[2] ]);
        hiShw.push([ k[0], k[1], k[2] ]);
      }
    });

    hiShw.forEach(function(x, c)
    {
        x[2]= x[2].replace(/\n|\r/g, ' ');;
        var q, nc= 50, cl= x[2].length, ch= [];
        for(var j= 0; j < cl; j+= nc)
        {
          q= x[2].substring(j, j+nc);
          if(q[0] === ' ') q= q.substr(1);
          ch.push( q );
        }

        ch= ch.join('\n     ');
        var p= ' TR: ' +ch;
        x[2]= p +'\n CR: '+' ~end';
    });

    sortem(3, 1);
    sortem(curTab= 2, -1); reFresh();
//    $('#mtb1').click();
    loadServer();
  }

  function loadServer2()
  {
    adminInfo.innerText+= '\nSERVER:load & import2\n';
    $.ajax(
    {
      url:appPath +'/ld2', type:'GET',
      error:function(e, f)
      {
        adminInfo.innerText+= 'FAIL@client:'+ f +'\n';
        $("#mtb3").click();
      },
      success:function(d, s, x)
      {
        adminInfo.innerText+= x.getAllResponseHeaders()
          + 'PASS:server load2 '+ (d.length/1024).toFixed(2) +'KB \n';

        importDB2(d);
      }
    });
  }
  
  function loadServer()
  {
    adminInfo.innerText+= '\nSERVER:load & import \n';
    $.ajax(
    {
      url:appPath +'/ld1', type:'GET',
      error:function(e, f)
      {
        adminInfo.innerText+= 'FAIL@client:'+ f +'\n';
//        ttxt= 'CACHE'; loadCache(true);
        $("#mtb3").click();
      },
      success:function(d, s, x)
      {
       // var d= r.replace(/\n|\r/g, '');
        adminInfo.innerText+= x.getAllResponseHeaders()
          + 'PASS:server load '+ (d.length/1024).toFixed(2) +'KB \n';
        ttxt= ' Clients ';
        importDB(d);
      }
    });
  }

  function logMe()
  {
    adminInfo.innerText+= 'SERVER:logme \n';
    $.ajax(
    {
      url:appPath +'/lgn:'+dbPass, type:'GET',
      error:function(e, f)
      {
        adminInfo.innerText+= 'FAIL@client:'+ f +'\n';
      },
      success:function(r, s, x)
      {
        if(r !== 'P@lg') {
          adminInfo.innerText+= 'FAIL@server:'+ r +'\n'; return; }
  
        adminInfo.innerText+= 
          x.getAllResponseHeaders() +'\n'+ 'PASS:logme logged \n';
        
        isLogged= true;
        $('#log4But').css({background:'none', 'box-shadow':'none'});
        $('#log4But').val("Logged"); $('#pasIn').css({display:'none'});
      }
    });
  }
  
  function saveDB(cchOnly)
  {
    // *** CACHE SAVE
    adminInfo.innerText+= 'CACHE:export & save \n';

    if(!window.localStorage) {
      adminInfo.innerText+= 'FAIL:window.localStorage \n'; return; }
    else
      adminInfo.innerText+= 'USING:window.localStorage \n';
    
    var rawdb= hiTab.join('|');

   
    var hiSave= '';
    hiTab.forEach(function(x)
    {
      var mg= x[8].split('#');
//      hiSave+= '|'+zipN(x[0])+':'+x[3]+':'+x[5]+':';

      mg.forEach(function(y)
      {
        var a= y.split('&');
        var pid= +a[0];
        var buy= +a[1];
        hiSave+= '#'+pid+'&'+buy;
      });
    });

    rawdb+= '@'+ hiSave.substr(1);
    localStorage.setItem('dataBase', rawdb);

    nBar.innerText+= ' [!]Cache save OK.';
    adminInfo.innerText+= 'PASS:cache save '+ (rawdb.length/1024).toFixed(2) +'KB \n';

    if(cchOnly) return;

    // *** SERVER SAVE
    adminInfo.innerText+= 'SERVER:export & save \n';

    if(!navigator.onLine) {
      adminInfo.innerText+= 'FAIL:navigator.online \n'; return; }
    else
    if(!isLogged) {
      adminInfo.innerText+= 'FAIL:no password\n';
      nBar.innerText= ' [!]Must be logged to update server database.'; return; }

    $.ajax(
    {
      url:appPath +'/sav:'+dbPass, data:rawdb, type:'POST',
      error:function(e, f)
      {
        adminInfo.innerText+= 'FAIL@client:'+ f +'\n';
      },
      success:function(r, s, x)
      {
        if(r.substring(0,4) !== 'P@sv') {
          adminInfo.innerText+= 'FAIL@server:'+ r +'\n'; return; }

        nBar.innerText+= ' [!]Server save '+ r.substr(5);
        adminInfo.innerText+= x.getAllResponseHeaders() +'\n'
          + 'PASS:server save '+ (rawdb.length/1024).toFixed(2) +'KB \n';
      }
    });
  }

  function loadDB()
  {
    if(!navigator.onLine)
    {
      adminInfo.innerText+= 'FAIL@navigator.offline \n';
//      ttxt= 'OFFLINE'; loadCache(true);
      $("#mtb3").click();
      return;
    }
    loadServer2();
  }

  // *** action starts here *********************************                     
  if(navigator.storage) {
    navigator.storage.persisted().then(function(getP) {
      if(getP) {
        $('#gpc4But').val("Persistance Granted");
        $('#gpc4But').css({background:'none', color:'black', 'box-shadow':'none'}); }
    });
  }
  clrAdmin();
  loadDB();


  // *** tab buttons listener ********************************
  var initOnceA= false;
  $(".mtb").click(function(e)
  {
    $(".mtb").removeClass("act dea").addClass("dea");
    $(this).removeClass("dea").addClass("act");

    $(".ptab").removeClass("pac pde").addClass("pde");
    var tid= "#tab"+ (this.id).substring(3,4);
    $(tid).removeClass("pde").addClass("pac");

    if(editMode) $("#mnu1").click();
    switch(tid)
    {
      case '#tab1': curTab= 1; nBar.innerText= tblInf[1]; break;
      case '#tab2': curTab= 2; nBar.innerText= tblInf[2]; break;
      case '#tab3': curTab= 3; nBar.innerText=' [~]System'; break;
    }
  });

  // *** BUTTONS #################################################
  $('.ord2').click( function() { clrAdmin(); });
  $('#headbar').click(function() {
    var t= nBar.innerText; nBar.innerText= lastNotif; lastNotif= t;  });
  $('.mnu, .mtb, .ord, .ord2, .ord3').click(function(e) { e.stopPropagation(); });

  $("#mnu1").click(function()
  { // star A.
    if(curTab === 3) {
      adminInfo.innerText+=
        ' [?]By Zele, Jul 2018. \n'; return; }


    resetEdit(curTab);
    if(editMode= !editMode)
    {
      $(".admin").css("display", "table-cell");
      $('.adminEdit').css('display', 'block');
      $('.filt').css('display', 'none');
    }
    else
    {
      $(".admin").css("display", "none");
      $('.adminEdit').css('display', 'none');
      $('.filt').css('display', 'block');
    }

    nBar.innerText= tblInf[curTab]; 
  });

  $("#mnu2").click(function()
  { // arrow B.
    if(curTab < 3) tbSpc[curTab]= (tbSpc[curTab] !== '40px')? '40px':'59px';
    else tbSpc[curTab]= (tbSpc[curTab] !== '300px')? '300px':'auto';
    setRowSpc();
  });
   
  $("#mnu3").click(function()
  { // line C.
    if(curTab === 3) {
      adminInfo.innerText=
        'What?! \n'; return; }

    if(++tbLst[curTab] > 3) tbLst[curTab]= 1;
    setRowCol();
  });

  // *** FILTERING ************************************
  function hntShow() {
    nBar.innerText= tblInf[1] +' [?]Press SPACE to toggle filter modes.'; }

  $('#t1fil, #t2fil').click(function(e)
  {//e.stopImmediatePropagation(); e.preventDefault();
    var inp, tis= '#t1in1', itb= +this.id[1];
    if(!itb || isNaN(itb)) itb= 1;
    if(itb === 2) tis= '#t2in1';

    var inp= $(tis).val(),
        tbs= Math.abs(tbSrt[itb])-1;

    fltInp[itb]= ''+ inp;
    var tps= plShw.splice(0);
    plShw.length= 0;
    for(var i= 0; i < tps.length; i++)
    {
      var x= tps[i];
      var c1, t1= x[1], c2, t2= x[2];
      if(tbs > 2) { t1= x[3]; t2= x[4]; }
      c1= t1.indexOf(inp); c2= t2.indexOf(inp);
      if(tbFmod[itb] === 2) { if(c1 >= 0 || c2 >= 0) plShw.push( x ); }
      else  { if(c1 === 0 || c2 === 0) plShw.push( x ); }
    }
    sortem(curTab= itb, tbSrt[itb]);
    reFresh(); $(tis)[0].focus();
  });

  $('#t1clr, #t2clr').click(function(e)
  { //e.stopImmediatePropagation(); e.preventDefault();
    var tis= '#t1in1', itb= +this.id[1];
    if(!itb || isNaN(itb)) itb= 1;
    if(itb === 2) tis= '#t2in1';

    fltNum[itb]= 1; fltStr[itb]= 'No Filters..';
    plShw.length= 0; plTab.forEach(function(x) { plShw.push( x ); });
    sortem(curTab= itb, tbSrt[itb])
    reFresh(); $(tis)[0].focus();
  });

  $('#t1in1, #t2in1').on('focus', function(e)
  {
    var i= +this.id[1]; if(!i || isNaN(i)) i= 1;
    this.select(); tbFmod[i]= 1; tiFresh(i); hntShow();
  });

  $('#t1in1, #t2in1').on('blur', function(e)
  { //e.stopImmediatePropagation(); e.preventDefault();
    var jq= $('#t1inf');
    var i= +this.id[1]; 
    if(!i || isNaN(i)) i= 1;

    if(i === 2) jq= $('#t2inf');
    if(fltNum[i] > 1) jq.text(fltStr[i]);
    else jq.text('No Filters..');
  });

  // *** INPUT TEXT FIELD ...............................
  $('#t1in1, #t2in1').on('keyup', function(e)
  {
    var itb= +this.id[1];
    if(!itb || isNaN(itb)) itb= 1;

    var t= ''+this.value;
    if(t === ' ')
    {
      if(tbFmod[itb] !== 1) { tbFmod[itb]= 1; tiFresh(itb); hntShow(); }
      else { tbFmod[itb]= 2; tiFresh(itb); hntShow(); }
    
      this.value= '';
      return;
    }
    else
    if(t === '') { tbFmod[itb]= 1; tiFresh(itb); hntShow(); }
    else if(t.length === 1) nBar.innerText= tblInf[itb];

    this.value= t.toUpperCase().replace(/[^A-Z 0-9]/, '');
  });

  $('.finf').on('keydown', function(e)
  {
    if(e.which !== 9 && e.which !== 13) return;
    $(this).next().click();
  });


  // *** TAB 1 : ADMIN BUTTONS ***************************************
  $('#raz1But').click(function()
  { //>Reset All to Zero<
    plTab.forEach(function(col) {
      col[2]= col[3]= col[5]= col[6]= col[7]= 0; col[4]= (-900 -col[0]); });
    
    hiTab.length= 0;
    reFresh();
  });

  // *** To be, or no delete?
  $('#rli1But').click( //>Remove Last ID<
    function() { plTab.splice(nextID-1, 1); reFresh(); });
  $("#rma1But").click(function() { //>Remove All<
    plTab.length= 0; hiTab.length= 0;
    reFresh(); });


  // *** TAB 3 : ADMIN BUTTONS **********************************
  $("#rdt3But").click(function()
  { //>Re-Date<
    var nd= $('#dtEdit').val();
    $('#htb>tr')[editRow]
      .cells[0].innerText= hiTab[editRow][0]= +nd;
  });
  
  $('#rmr3But').click(function() { //>Remove<
    hiTab.splice(editRow, 1);
    reFresh(); });
  
  // *** tab3 - class="ord2" : DARK BOTTOM BUTTON
  $("#rcl3But").click(function() { //>Recalculate All<
    $('#mtb1').click(); });
  $("#rma3But").click(function() { //>Remove All<
    hiTab.length= 0; reFresh(); });
  
  // *** TAB 4 : ADMIN BUTTONS ***************************************
  $("#log4But").click(function() { //>Log In<
    if(isLogged) return; dbPass= $('#pasIn').val(); logMe(); });
  
  // *** class="ord2" : DARK BOTTOM BUTTON
  $("#cad4But").click( function() { // >Cache Data<
//    loadCache(false);
  });
  $("#imc4But").click( function() { // >Import Cache<
//    ttxt= 'IMPORT'; loadCache(true);
  });
  $("#stc4But").click( function() { // >Store Cache<
    saveDB(true); });

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

  $("#med4But").click(function()
  { //>Memory Data<
    var as= '';
    adminInfo.innerText+= '\n'+'[plTab: '+ plTab.length+']\n'
      + 'pid\t name\t $buy\t $won\t $bal\t #ngm\t %buy\t %won \n';
    plTab.forEach(function(r) {
      as+= ''+ r[0]+'\t '+r[1]+'\t '+r[2]+'\t '+r[3]
        +'\t '+r[4]+'\t '+r[5]+'\t '+r[6]+'\t '+r[7]+'\n'; });
    adminInfo.innerText+= as;
    as= '';
    adminInfo.innerText+= '\n'+'[hiTab: '+ hiTab.length+']\n'
      + 'dtm   #   $bank    $1st\t :name\t $2nd\t :name\t rid\t #<pid:buy..> \n';
    hiTab.forEach(function(r, c) {
      as+= ''+ (r[0])+'  '+r[1]+'\t '+r[2]+'\t '+r[3]
        +'\t '+r[4]+'\t '+r[5]+'\t '+r[6]+'\t '+r[7]+'\t '+r[8]+'\n'; });
    adminInfo.innerText+= as;
  });

  $("#sld4But").click( function() { loadDB(); }); //>Server Load<
  $("#ssv4But").click( function() { saveDB(); }); //>Server Save<

}); // THE END
