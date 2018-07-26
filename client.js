$(document).ready(function()
{
  var versionCode= 'v1.0r05b \n';
  var appPath= 'https://sns.glitch.me';
  $.ajaxSetup({async:true, cache:false, timeout:9999,
               dataType:'text', contentType:'text/plain', processData:false});
  
  var nBar= document.getElementById('notif');
  var adminInfo= document.getElementById('dbFrame');

  var nextID= 0;

  var dbPass= '*';
  var isLogged= false;
  var ttxt= 'Connecting...';

  var curTab= 1;
  var lastTab= 0;
  var editRow= -1;
  var editMode= false;

  var tbSpc= [0, '40px','40px','300px'];
  var tbLst= [0, 1,1];
  var tbSrt= [0, 2,-1];
  var tbFcol= [0, 0,0];
  var tbFmod= [0, 0,0];
  var tblInf= [0, '~tblInf1','~tblInf2'];
  var fltInf= [0, '~fltInf1','~fltInf2'];
  
  var recNum= [0, 0,0];
  var fltNum= [0, 1,1];
  var fltMax= [0, 0,0];
  var fltInp= [0, '',''];
  var fltStr= [0, '~fltStr','~fltStr'];

// *** PLAYER TAB
  var plTab= [0, 'first', 'last', 'tel', 'mob'];
  var plShw= [0, 'first', 'last', 'tel', 'mob'];
// *** HISYORY TAB TABLE
  var hiTab= ['2001-11-27', 0, 'info'];
  var hiShw= ['2001-11-27', 0, 'name','info'];


  function setRowCol(ct)
  {
    if(!ct) ct= curTab;
    switch(ct)
    {
      case 1:
        $('#ptb>tr').css({border:'none'});
        $('#ptb>tr').removeClass().addClass("clean");
        switch(tbLst[ct])
        {
          case 1: $('#ptb>tr').removeClass(); break; 
          case 2: $('#ptb>tr').css('border-top', '1px solid lightgrey');
        }
      break;

      case 2:
        $('#htb>tr').css({border:'none'});
        $('#htb>tr').not('.selected, .extra').removeClass().addClass("clean");
        switch(tbLst[ct])
        {
          case 1:
            $('#htb>tr').not('.selected, .extra').removeClass('clean');
            $('#htb>tr.extra').css({color:'white', background:'black'});
          break;

          case 2:
            $('#htb>tr').css({'border-top':'1px solid lightgrey'});
            $('#htb>tr.extra').css({color:'black', background:'#f0f0f0'});
          break;

          case 3:
            $('#htb>tr.extra').css({color:'white', background:'#3f3f3f'});
          break;
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
      if(tbLst[curTab] !== 1) $(row).addClass("clean");
      nBar.innerText= xi;
      return;
    }

    $(row).removeClass('clean').addClass('selected');
    nBar.innerText= xi + ' @'+ xx +':'+ cid2nme(xx);
  }

  function sortem(tab, col)
  {
    tbSrt[tab]= col;
    var rev= (col < 0);
    col= Math.abs(col)-1;

    var t= (tab === 1) ? plShw : hiShw;
    if(t.length < 1) return;
    
//    if(isNaN(t[0][col]))
    { // alpha
      t.sort(function(a, b)
      {
        if(b[col] > a[col]) return -1;
        else if(b[col] < a[col]) return 1;
        else return 0;
      });
    }
//    else // numeric
  //    t.sort(function(a, b) { return +b[col] - (+a[col]); });
    
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


  // *** tabs# redraw... ************************************************
  function freshTab1()
  {
    nextID= 0;
    $("#ptb").empty();
    var i, ml= Math.min(99, plShw.length);
    for(i= 0; i < ml; i++)
    {
      var col= plShw[i];
      if(col[0] > nextID) nextID= col[0];
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
  function freshTab2()
  { 
    $('#htb').empty();
    var i, ml= Math.min(99, hiShw.length);
    for(i= 0; i < ml; i++)
    {
      var col= hiShw[i];
      $('#htb').append( '<tr tabindex="1">'
                       +'<td>'+ col[0]
                       +'</td><td class="admin" style="text-align:right">'+ col[1]
                       +'</td><td style="font-size:12px; white-space:pre">'+ col[2]
                       +'</td><td style="text-align:right">'+ col[3]
                       +'</td></tr>');
    }
    recNum[2]= i;
  }

  function tiFresh(t)
  {
    var cln= false, jq= $('#t2inf');
    if(t < 0) { t*= -1; cln= true; }
    if(!t || t === 1) { t= 1; jq= $('#t1inf'); }

    if(fltNum[t] === 1) fltStr[t]= '';

    if(cln)
    {
      if(fltNum[t] === 1) fltStr[t]= 'Filters..';
//      $('#t1in1').value= '';
      jq.text(fltStr[t]);
    }
    else
    { 
      var fc= (tbFcol[t] === 1)? 'NAME' : 'PHONE';
      var fm= (tbFmod[t] === 1)? '<begins with>' : '<contains>';
      fltInf[t]= fc + fm +'"..'; jq.text(fltStr[t] + fltInf[t]);
    }
  }

  function reFresh()
  {
    var a, b, c;
    $('#mtb1').val(ttxt);
    switch(curTab)
    {
      case 1: freshTab1();
        a= recNum[1]; b= plShw.length; c= plTab.length;
        if(fltNum[1] === 1)
        {
          fltMax[1]= c;
          $('#t1in1')[0].display= 'initial';
          $('#t1fil')[0].disabled= false;
        }

        if(b < fltMax[1])
        {
          if(fltNum[1] < 3)
          {
            if(++fltNum[1] > 2)
            {
              $('#t1fil')[0].disabled= true;
              $('#t1in1')[0].display= 'none';
            }
            else
            {
              fltMax[1]= b;
            }
          }
          else
            nBar.innerText= ' [!]Two filters maximum.';

          fltStr[1]+= fltInf[1].slice(0,-2) + fltInp[1] +'"   ';
//          tiFresh(-1);
        }
//        else
          tiFresh(-1);
      break;
      
      case 2: freshTab2();
        a= recNum[2]; b= hiShw.length; c= hiTab.length;
        if(fltNum[2] === 1) fltMax[2]= c;
        if(b < fltMax[2])
        {
          if(fltNum[2] < 3)
          {
            fltNum[2]++; fltMax[2]= b;
            if(fltNum[2] > 2) fltNum[2]= 2;
            fltStr[2]+= fltInf[2] +'"'+ fltInp[2] +'"   ...';
          }
          else
            nBar.innerText= ' [!]Two filters maximum.';
            
          tiFresh(1);
        }
        else
          tiFresh(-1);    
      break;
    }
    
    setRowSpc(); setRowCol();
    nBar.innerText= tblInf[1]= ' [#]'+ a +'/'+ b +'('+ c +')';

    lastTab= curTab;

// whats this for?
    if(editMode) $(".admin").css("display", "table-cell");
    else $(".admin").css("display", "none");
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
    return '~not found';
  }

  $('#playerTable').click(function(e)
  { 
    var etpn= e.target.parentNode;
    if(etpn.rowIndex === undefined) etpn= e.target;
    var trx= etpn.rowIndex;

    if(trx === 0)
    {
      var os= tbSrt[1], s= e.target.cellIndex;
      s= (0 < os && Math.abs(os) -1 === s)? -(s+1) : s+1;
      sortem(1, s);

      reFresh();
      return;
    }

    if($(etpn).hasClass('selected')) rowAnim(trx, false);
    else 
    {
      $('#ptb>tr').removeClass('selected');
      rowAnim(trx, true);
    }
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
    
    if($(etpn).hasClass('selected')) rowAnim(trx, false);
    else 
    {
      $('#htb>tr').removeClass('selected');
      rowAnim(trx, true);
    }
  });
  
  // *** import... **************************************************
  function importDB(d)
  { // *** UNPACK & IMPORT
    var dl= d.split('\n');
    plTab.length= plShw.length= 0;
    dl.forEach(function(x)
    {
      var k= x.split('\t');
      k[0]= +k[0];

      k[1]= k[1].toUpperCase();
      k[2]= k[2].toUpperCase();

      if(k[1].length < 3) k[1]= '~first';
      if(k[2].length < 3) k[2]= '~last';
      if(k[3].length < 3) k[3]= '~tel.';
      if(k[4].length < 3) k[4]= '~mob.';
      
//      k[1]= k[1].substr(0,15);
  //    k[2]= k[2].substr(0,20);

//      k[3]= k[3].replace(/\D/g,'').substr(0,12);
  //    k[4]= k[4].replace(/\D/g,'').substr(0,12);

//      k[3]= k[3].substr(0,12);
  //    k[4]= k[4].substr(0,12);

      k[3]= k[3].toLowerCase();
      k[4]= k[4].toLowerCase();

      plTab.push( k );
      plShw.push( k );
    });

    sortem(curTab= 1, 2); reFresh();
    $('#mtb1').click();
  }


  function importDB2(d)
  {
    var dl= d.split('\n');
    hiTab.length= hiShw.length= 0;
    dl.forEach(function(x)
    {
      var k= x.split('\t');

      if(k[0].length < 3) k[0]= '~date';
      k[1]= +k[1];
      if(k[2].length < 3) k[2]= '~treatmeng description';

//      k[0]= k[0].substr(0,10);
  //    k[2]= k[2].substr(0,200);
      k[2]= k[2].toLowerCase();
      hiTab.push( k );
      hiShw.push([ k[0], k[1], cid2nme(k[1],'\n'), k[2] ]);
    });

    sortem(curTab= 2, -1); reFresh();
    $('#mtb2').click();
  }

  function loadServer()
  {
    adminInfo.innerText+= 'SERVER:load & import \n';
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
        adminInfo.innerText+= x.getAllResponseHeaders() +'\n'
          + 'PASS:server load '+ (d.length/1024).toFixed(2) +'KB \n';
        ttxt= ' Clients ';
        importDB(d);
      }
    });

    adminInfo.innerText+= 'SERVER:load & import 2\n';
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
        adminInfo.innerText+= x.getAllResponseHeaders() +'\n'
          + 'PASS:server load '+ (d.length/1024).toFixed(2) +'KB \n';

        importDB2(d);
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
        if(r !== 'pOkk') {
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
        if(r.substring(0,4) !== 'size') {
          adminInfo.innerText+= 'FAIL@server:'+ r +'\n'; return; }

        nBar.innerText+= ' [!]Server save '+ r.substring(5);
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
    loadServer();
  }

  // *** action starts here *********************************                     
  if(navigator.storage) {
    navigator.storage.persisted().then(function(getP) {
      if(getP) {
        $('#gpc4But').val("Persistance Granted");
        $('#gpc4But').css({background:'none', color:'black', 'box-shadow':'none'}); }
    });
  }
  curTab= 3; reFresh();
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

//    reFresh();
  });

  // *** BUTTONS #################################################

  $("#mnu1").click(function()
  { // star A.
    if(curTab === 3) {
      adminInfo.innerText+=
        'Made by zele-chelik!, Jul 2018. \n'; return; }

    if(editMode= !editMode)
    {
      $(".admin").css("display", "table-cell");
      $('.adminEdit').css('display', 'block');
    }
    else
    {
      $(".admin").css("display", "none");
      $('.adminEdit').css('display', 'none');
    }
  });

  $("#mnu2").click(function()
  { // arrow B.
    if(curTab < 3) tbSpc[curTab]= (tbSpc[curTab] !== '40px')? '40px':'50px';
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
  $('#t1fil').click(function()
  {
    var i1= $('#t1in1').val(),
        os= Math.abs(tbSrt[1])-1;

    fltInp[1]= ''+ i1;
    var tps= plShw.splice(0);
    plShw.length= 0;
    for(var i= 0; i < tps.length; i++)
    {
      var x= tps[i];
      var c1, t1= x[1], c2, t2= x[2];
      if(os > 2) { t1= x[3]; t2= x[4]; }

      c1= t1.indexOf(i1); c2= t2.indexOf(i1);
      if(tbFmod[1] === 1) { if(c1 === 0 || c2 === 0) plShw.push( x ); }
      else if(c1 >= 0 || c2 >= 0) plShw.push( x );
    }
    
    sortem(curTab= 1, tbSrt[1]); reFresh();
    if($('#t1in1').is(':focus')) $('#t1in1')[0].blur();
  });

  $('#t1clr').click(function()
  {
    plShw.length= 0; fltNum[1]= 1; fltStr[1]= 'Filters..';
    plTab.forEach(function(x) { plShw.push( x ); });

    sortem(curTab= 1, tbSrt[1]);
    reFresh();
  });


  // *** INPUT TEXT FIELD ...............................
  function hntShow() {
    nBar.innerText= tblInf[1] +' [?]Press <SPACE> to toggle filter mode.'; }
    
  $('#t1in1').on('keyup', function(e)
  {
    var t= ''+this.value;
    if(t === ' ')
    {
      if(tbFmod[1] !== 1) {
        tbFmod[1]= 1; tiFresh(1); hntShow(); }
      else {
        tbFmod[1]= 2; tiFresh(1); hntShow(); }
    
      this.value= '';
      return;
    }
    else
    if(t === '') {
      tbFmod[1]= 1; tiFresh(1); hntShow(); }
    else
    if(t.length === 1)
      nBar.innerText= tblInf[1];

    this.value= t.toUpperCase().replace(/[^A-Z 0-9]/, '');
  });

  $('#t1in1').on('focus', function(e)
  {
    this.select();
    tbFmod[1]= 1; tiFresh(1); hntShow();
  });

  $('#t1in1').on('blur', function(e)
  {
//    fltInp[1]= ''+ this.value;
    nBar.innerText= tblInf[1];
    tiFresh(-1); //this.value= '';
  });
  
  $('.finf').on('keydown', function(e)
  { // if(e.which === 8) this.value= '';
//    e.preventDefault();
    if(e.which !== 9 && e.which !== 13) return;
    tiFresh(-1);
    $(this).next().click();
//    this.blur();
//    if($(this).is(':focus')) this.blur();
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
