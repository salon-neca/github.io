$(document).ready(function()
{
  var versionCode= 'v0.s01h ::Zele, Aug\'18. \n';
  var appPath= 'https://sns.glitch.me';
  $.ajaxSetup({async:true, cache:false, timeout:19999});
  
  var nBar= document.getElementById('notif');
  var adminInfo= document.getElementById('dbFrame');

  var nextID= 0;

  var dbPass= '*';
  var isLogged= false;
  var ttxt= 'Loading...';

  var curTab= 1;
  var lastTab= 0;
//  var editRow= -1;
  var edtRow= [-1, -1,-1];
  var curSpid= -1;
  var editMode= false;
  var eefmod= [0, 0,0];

  var tbSpc= [0, '40px','40px','300px'];
  var tbLst= [0, 1,1];
  var tbSrt= [0, 2,-1];
  var tbAll= [99, 99,99];

  var tbFmod= [0, 1,1];
  var tbFcol= [0, '',''];
  var tblInf= [0, '~tI1','~tI2'];
  var fltInf= [0, '~fI1','~fI2'];

  var recNum= [0, 0,0];
  var recFil= [0, 0,0];
  var fltNum= [0, 0,0];
  var fltMax= [0, 0,0];
  var fltInp= [0, '',''];
  var fltStr= [0, '~fS1','~fS2'];

// *** PLAYER TAB
  var plTab= [0, 'first', 'last', 'tel', 'mob', '[memo]', 0];
// *** HISYORY TAB TABLE
  var hiTab= [0, 0, '~tr','~cr', 0];
  
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

        $('#ptb>tr.xtrR').css({background:'#303030'});
        $('#ptb>tr.xtrR').find('pre').css({color:'white', background:'black'});
        switch(tbLst[ct])
        {
          case 1:
            $('#ptb>tr').not('.selR, .xtrR').removeClass('clnR');
          break;

          case 2:
            $('#ptb>tr').css({'border-top':'1px solid lightgrey'});
            $('#ptb>tr.xtrR').css({background:'#fafafa'});
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
    var jq= '#ptb>tr'; i--;
    if(curTab === 2) jq= '#htb>tr';

    var b, c, r= $(jq)[i];
    if(curTab !== 2) c= r.firstChild.innerText;
    else c= r.firstChild.nextSibling.innerText;
    
    if(curTab === 2) b= tblInf[2]; else b= tblInf[1];
    if(!o)
    {
//      editRow= -1;
      $(r).removeClass(); nBar.innerText= b;
      if(tbLst[curTab] !== 1) $(r).addClass('clnR');
      return;
    }
    $(r).removeClass('clnR').addClass('selR');
    nBar.innerText= b + ' [@]'+ c +':'+ id2nme(+c);
  }

  function resetEdit(tab, jin)
  {
//    editRow= curSpid= -1;

    if(tab !== 2) tab= 1;
    eefmod[tab]= 0;
        edtRow[tab]= curSpid= -1
    if(tab === 2)
    {
      if(jin) return;
      $('#htb>tr.xtrR').remove();
      $('#htb>tr').removeClass();
      if(tbLst[2] !== 1) $('#htb>tr').addClass('clnR');
      return;
    }

    $('#ta1mrg')[0].disabled= true;
    $('#ta1rmv')[0].disabled= true;
    $('#ta1sub')[0].disabled= false;

    $('#ta1sub').val('New Client');
    $('#t1e0').val( 'next id@ '+ nextID );

    $('.clPinf').css({display:'none'});
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

    var t= plTab;
    if(tab !== 1) t= hiTab;
    if(t.length < 2) return;

    if(isNaN(t[0][col]))
    { // alpha
      t.sort(function(a, b)
      {
        if(b[col] > a[col]) return -1;
        else if(b[col] < a[col]) return 1;
        else return 0;
      });
    }
    else // numeric
      t.sort(function(a, b) { return +b[col] - (+a[col]); });

    if(rev) t.reverse();
    if(tab === 1)
    { // *** header
      $('#pth>tr').children().css({border:'none'});
      $("#pth>tr").children().eq(col).css({border:'2px solid grey'});
      
      $('#t1in1').val('');
      if(col === 0) {
        $('#t1in1').attr({placeholder:'#id'}); tbFcol[1]= '#id'; }
      else
      if(col < 3) {
        $('#t1in1').attr({placeholder:'NAME'}); tbFcol[1]= 'NAME'; }
      else {
        $('#t1in1').attr({placeholder:'PHONE'}); tbFcol[1]= 'PHONE'; }
    }
    else
    if(tab === 2)
    { // *** header
      $('#hth>tr').children().css({border:'none'});
      $('#hth>tr').children().eq(col).css({'border':'2px solid grey'});

      $('#t2in1').val('');
      if(col === 0) {
        $('#t2in1').attr({placeholder:'DATE'}); tbFcol[2]= 'DATE'; }
      else
      if(col === 1) {
        $('#t2in1').attr({placeholder:'#cid'}); tbFcol[2]= '#cid'; }
      else {
        $('#t2in1').attr({placeholder:'SESSION'}); tbFcol[2]= 'SESSION'; }
    }
  }
  
  function curDTM()
  {
    var curDate= new Date();
    var r= curDate.getFullYear()
               + ("00"+(curDate.getMonth()+1)).slice(-2)
               + ("00"+curDate.getDate()).slice(-2);
    return r; //.substr(2);
  }

  function chunkStr(nc, s)
  { //alert(1);
    var ret='', ch= [];
    s= s.replace(/\n|\r/g, ' ');
    for(var i= 0; i < s.length; i+= nc)
    {
      ret= s.substring(i, i+nc);
      if(ret[0] === ' ') ret= '-'+ret.substr(1);
      ch.push( ret );
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
      if(x[1] === rx)
      {
        tn++;
        trs.push([ +x[0], chunkStr(63, x[2]), chunkStr(63, x[3]) ]);
      }
    }

    trs.sort(function(a, b) {
      return +a[0] - (+b[0]); });

    trs.forEach(function(tr, i)
    {
      i++;
      ns= '#'+ ('0'+i).slice(-2) +'. ';
      ppp= ns +'DATE:  '+ ndt2sdt(tr[0]) +'\nTREATMENT:  ' +tr[1];
      cs+= ppp+'\n   CREAMS:  '+ tr[2] +'\n\n';
    });

    return cs; //+'~'+'..creams..'; //.slice(0,-2);
  }

  function id2mmo(c)
  {
    for(var i= 0; i < plTab.length; i++)
    {
      if(plTab[i][0] === c) return plTab[i][5];
    }
    return '~notFound@'+ c;
  }


  // ____________________________________________________________________
  // *** tabs# redraw... ************************************************
  function freshTab1()
  {
    nextID= plTab.length +2000;

    $("#ptb").empty();
    if(tbAll[1] === 0)
      tbAll[1]= plTab.length;

    var i, x, tth, rn= 0;
    var ml= Math.min(tbAll[1], plTab.length);
    for(i= 0; rn < ml && i < plTab.length; i++)
    {
      x= plTab[i];
      tth= (eefmod[1] === 0)?
        (x[6] >= fltNum[1]) : (x[0] === eefmod[1]);

      if(tth)
      {
        $('#ptb').append( '<tr tabindex="1">'
                        +'<td class="admin">'+ x[0]
                        +'</td><td>'+ x[1]
                        +'</td><td>'+ x[2]
                        +'</td><td>'+ x[3]
                        +'</td><td>'+ x[4] //+col[5]
                        +'</td><td style="display:none">'+ (rn++)
                        +'</td></tr>' );
      }
    }

    recNum[1]= rn;
    tbAll[1]= tbAll[0];

    if(fltNum[1] === 0) recFil[1]= plTab.length;
    if(i === plTab.length) $('#t1all')[0].disabled= true;
    else $('#t1all')[0].disabled= false;
  }

  var msa= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
                          'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  function ndt2sdt(nd)
  {
    nd= (''+nd);
    var m= +(nd.substr(4,2));
    return nd.substr(6,2) +' '+ msa[m-1] +" "+ nd.substr(0,4);
  }

  function freshTab2()
  {
    $('#htb').empty();
    if(tbAll[2] === 0)
      tbAll[2]= hiTab.length;

    var i, x, tth, rn= 0;;
    var ml= Math.min(tbAll[2], hiTab.length);
    for(i= 0; rn < ml && i < hiTab.length; i++)
    {
      x= hiTab[i];
      tth= (eefmod[2] === 0)?
        (x[4] >= fltNum[2]) : (x[1] === eefmod[2]);

      if(tth)
      {
        $('#htb').append( '<tr tabindex="1">'
                         +'<td style="text-align:center">'+ ndt2sdt(x[0])
                         +'</td><td style="text-align:right">'+ x[1]
                         +'</td><td >'+ ' TR: '+ x[2] +'\n CR: '+ x[3]
                         +'</td><td style="display:none">'+ (rn++)
                         +'</td></tr>');
      }
    }

    recNum[2]= rn;
    tbAll[2]= tbAll[0];
    
    if(fltNum[2] === 0) recFil[2]= hiTab.length;
    if(i === hiTab.length) $('#t2all')[0].disabled= true;
    else $('#t2all')[0].disabled= false;
  }

  function tiFresh(tn)
  {
    var cln= false, jq= $('#t2inf');
    if(tn < 0) { tn*= -1; cln= true; }
    if(tn !== 2) { tn= 1; jq= $('#t1inf'); }

    if(cln)
    {
      if(eefmod[tn] > 0)
      {
        var cid= eefmod[tn];
        jq.text('1.ID<equals>"'+ cid +'"  '
                +'2.NAME<equals>"'+ id2nme(+cid) +'"');
                return;
      }

      if(fltNum[tn] === 0) fltStr[tn]= 'No Filters..';
      jq.text(fltStr[tn]);
      return;
    }

    if(fltNum[tn] === 0) fltStr[tn]= '';
    var fc= tbFcol[tn]; //(tbFcol[t] === 1)? 'NAME' : 'PHONE';
    var fm= (tbFmod[tn] === 1)? '<begins with>' : '<contains>';
    fltInf[tn]= ''+ (fltNum[tn]+1) +'.'+ fc + fm +'"..';
    jq.text(fltStr[tn] + fltInf[tn]);
  }

  function reFresh()
  {
    var i= curTab, j1, j2, a, b, c;
    $('#mtb1').val(ttxt);
    switch(curTab)
    {
      case 1: freshTab1();
        j1= $('#t1fil'), j2= $('#t1in1');
        a= recNum[i]; b= recFil[i]; c= plTab.length;
      break;
      case 2: freshTab2();
        j1= $('#t2fil'), j2= $('#t2in1');
        a= recNum[i]; b= recFil[i]; c= hiTab.length;
      break;
    }
    
    setRowSpc(); setRowCol();
    nBar.innerText= tblInf[i]= ' [#]'+ a +'/'+ b +'('+ c +')';
    
        if(fltNum[i] === 0)
        {
          j1[0].disabled= false;
          j2[0].disabled= false;
          fltMax[i]= c;
        }

        if(b < fltMax[i] && fltNum[i] < 3)
        {
          fltMax[i]= b;
          if(fltNum[i] === 2)
          {
            j1[0].disabled= true;
            j2[0].disabled= true;
          }
          fltStr[i]+= fltInf[i].slice(0,-2) + fltInp[i] +'"  ';
        }

        j2.val('');
        tiFresh(-i);


// emmm...
    if(editMode) $(".admin").css("display", "table-cell");
    else $(".admin").css("display", "none");

    lastTab= curTab;
  }
  // *** END REFRESH *****************************************


  // *** subRow-content - REMOVE
  function subrowDelete(etpn)
  {
    rowAnim(etpn.previousSibling.rowIndex, false);
    $(etpn).remove();
    resetEdit(curTab);
  }

  var noRst= false;
  $('#playerTable').click(function(e)
  {
    var tmp, cid, et= e.target;
    
    if($(et).hasClass('ord3'))
    {
      cid= $(et).closest('tr')[0].previousSibling.firstChild.innerText;
      nBar.innerText= ' @'+ cid +':'+ id2nme(+cid);

      var tre, cre, epp;
      if(editMode && et.value[0] === 'E')
      {
        for(i= 0; i < hiTab.length; i++)
        {
          if(hiTab[i][0] === +cid) hiTab[i][4]= 9;
          else hiTab[i][4]= 0;
        }

        eefmod[2]= +cid;
//        sortem(curTab= 2, 1);
        
//alert(0);
//        $('#historyTable>tr').children('td').eq(1).click();
        
        $('#mtb2').click();
        
//        editRow= -1;
        edtRow[1]= -1;
        reFresh();
        $('#t2fil')[0].disabled= true;
      }
      else
      if(et.value[0] === 'E')
      {
        epp= et.previousSibling;
        $(epp).before(
           '<textarea placeholder="MEMO" rows="5" style="font-size:18px; width:644px; '
          +'border:1px solid red; user-select:text; '//font-weight:bold; '
          +'margin:3px; padding:9px" ></textarea>');

        et.value= 'Apply Edit';
        et.previousSibling.disabled= true;
        epp= epp.previousSibling;
        epp.innerText= id2mmo(+cid);

        tmp= $(et).closest('tr');
        if(tmp[0].getBoundingClientRect().bottom > window.innerHeight)
          tmp[0].scrollIntoView(false); // document.documentElement.scrollTop+= h;
        
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
        for(var i=0; i < plTab.length; i++)
        {
          if(plTab[i][0] === +cid)
          { //nBar.innerText= 'Apply @'+ x[0] +':'+ x[1] +' '+ x[2];
            plTab[i][5]= epp.value;
          }
        }
        epp.previousSibling.previousSibling.innerText=
          id2trs(+cid) +'\n**** MEMO:  '+ chunkStr(63, id2mmo(+cid)) +'\n\n';
        $(epp).remove();
      }
      else
      if(et.value[0] === 'N')
      {
//        tmp= id2trs(+cid, 1).split('^'); tmp[0],tmp[1]
        $(et).before(
           '<textarea placeholder="TREATMENT" rows="5" style="font-size:18px; width:644px; '
          +'border:1px solid red; user-select:text; '//font-weight:bold; '
          +'margin:3px; padding:9px" ></textarea>');

        $(et).before(
           '<textarea placeholder="CREAMS" rows="3" style="font-size:18px; width:644px; '
          +'border:1px solid red; user-select:text; '// font-weight:bold; '
          +'margin:3px; padding:9px" ></textarea>');

        et.value= 'Finish and Save';
        et.nextSibling.disabled= true;
        tmp= et.previousSibling; //creams
        epp= tmp.previousSibling; //treatment

        tmp= $(et).closest('tr');
        if(tmp[0].getBoundingClientRect().bottom > window.innerHeight)
          tmp[0].scrollIntoView(false); // document.documentElement.scrollTop+= h;
        
        epp.focus();
      }
      else
      if(et.value[0] === 'F')
      {
        et.value= 'New Session';
        et.nextSibling.disabled= false;
        tmp= et.previousSibling; //creams
        epp= tmp.previousSibling; //treatment

        tre= epp.value, cre= tmp.value;
        $(epp).remove(); $(tmp).remove();

        // *** save hiTab
        hiTab.push([ curDTM(), +cid, tre, cre, 0 ]);
        et.previousSibling.previousSibling.innerText=
          id2trs(+cid) +'\n**** MEMO:  '+ chunkStr(63, id2mmo(+cid)) +'\n\n';

        setTimeout(function() {
          sortem(curTab= 2, 1);
          reFresh(); $('#mtb1').click();
        }, 99);
      }
      return;
    }


    if($(et).is('textarea')) { e.stopPropagation(); return; }

    var row, tx, ti;
    if(!$(et).is('tr')) ti= $(et).closest('tr')[0];
    tx= ti.rowIndex; if($(ti).hasClass('xtrR')) tx--;

    if(tx > 0)
    {
      row= $('#ptb>tr')[tx-1];
      ti= +row.cells[5].innerText;
      cid= row.cells[0].innerText;
    }
    else tx= 0;

    if(tx === 0)
    { // *** table headers, do sort
      var os= tbSrt[1], s= e.target.cellIndex;
      s= (0 < os && Math.abs(os) -1 === s)? -(s+1) : s+1;
      sortem(1, s);

      reFresh();
      return;
    }
//    else      alert('Ooops! This was not supposed to happen: #playerTable.click()');
    
//    if($(et).hasClass('xtrR')) { subrowDelete( et ); return; }
    if($(row).hasClass('selR')) { subrowDelete(row.nextSibling); return; }

    noRst= false;
    resetEdit(1, noRst);
    tx= ti; tx++;
//    editRow= tx;
    edtRow[1]= tx;
    curSpid[1]= +cid;

    // *** subRow-content - CREATE
    if(editMode)
    {
      $('#ta1sub').val('Edit Client');
      $('#t1e0').val( +cid );
      $('#t1e1').val( row.cells[1].innerText );
      $('#t1e2').val( row.cells[2].innerText );
      $('#t1e3').val( row.cells[3].innerText );
      $('#t1e4').val( row.cells[4].innerText );

      $('#ta1mrg')[0].disabled= true;
      $('#ta1rmv')[0].disabled= false;
      $('#ta1sub')[0].disabled= false;
    }
    
    var xTxt= id2trs(+cid) +'\n**** MEMO:  '
                + chunkStr(63, id2mmo(+cid)) +'\n\n';

    var cn= 31, plInf= 'id@ '+ cid +':'+ id2nme(+cid);
    if(plInf.length > cn) plInf= plInf.substr(0,cn-2) +'..';
    else plInf= plInf.substr(0,cn);

    
    if(editMode)
    {
      $(row).after(
          '<tr class="xtrR"><td colspan='+ (editMode? 5:4) +'>'
        + '<pre style="padding:9px 9px; margin:5px 0 7px; text-align:left; '//pointer-events:none
        + 'font-size:14px; border:1px dashed grey; user-select:text">' //
        + ''+ xTxt +'</pre>' 
        + '<pre style="font-size:17px; width:330px; ' //border-right:1px solid red; '
        + 'pointer-events:none; padding:3px 5px; float:left">'+ plInf +'</pre>'
        + '<input class="ord3" type="button" style="float:right" value="Edit Sessions" >'
        + '</td></tr>');
    }
    else
    {
      $(row).after(
          '<tr class="xtrR"><td colspan='+ (editMode? 5:4) +'>'
        + '<pre style="padding:9px 9px; margin:5px 0 7px; text-align:left; '//pointer-events:none
        + 'font-size:14px; border:1px dashed grey; user-select:text">' //
        + ''+ xTxt +'</pre>' 
        + '<pre style="font-size:17px; width:330px; ' //border-right:1px solid red; '
        + 'pointer-events:none; padding:3px 5px; float:left">'+ plInf +'</pre>'
        + '<input class="ord3" type="button" style="float:right" value="New Session" >'
        + '<input class="ord3" type="button" style="float:right" value="Edit Memo" >'
        + '</td></tr>');
    }
      
    rowAnim(tx, true);
    setRowCol();

    tmp= $(row.nextSibling);
    if(tmp[0].getBoundingClientRect().bottom > window.innerHeight)
      tmp[0].scrollIntoView(false); // document.documentElement.scrollTop+= h;
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
    else {
      //$('#htb>tr').removeClass('selR');
      rowAnim(trx, true);
//      $(etpn).css({'word-wrap':'break-word'});
      //alert(hiTab[trx-1][2]);
    }
  });
  
  // *** import... **************************************************
  function importDB(d)
  { // *** UNPACK & IMPORT
    var dl= d.split('\n');
    plTab.length= 0;
    dl.forEach(function(x)
    {
      var k= x.split('\t');

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
      if(k[3].length < 5) k[3]= '~pho.';
      if(k[4].length < 5) k[4]= '~mob.';

      k[3]= k[3].toLowerCase();
      k[4]= k[4].toLowerCase();

      k[1]= k[1].replace(/\n|\r|\t/gi, ' #');
      k[2]= k[2].replace(/\n|\r|\t/gi, ' #');
      k[3]= k[3].replace(/\n|\r|\t/gi, ' #');
      k[4]= k[4].replace(/\n|\r|\t/gi, ' #');
      
      k[1]= k[1].replace(/\s+/gi,' ').trim();
      k[2]= k[2].replace(/\s+/gi,' ').trim();
      k[3]= k[3].replace(/\s+/gi,' ').trim();
      k[4]= k[4].replace(/\s+/gi,' ').trim();

//      var ts= id2trs(+k[0]);
  //    if(ts.length > 3)
      {
        plTab.push([ +k[0],k[1],k[2],k[3],k[4], '', 0 ]);
      }
    });

    sortem(curTab= 1, 2);
    reFresh(); $('#mtb1').click();
  }


  function importDB2(d)
  {
    var i, k, dl= d.split('\n');
    hiTab.length= 0;
    dl.forEach(function(x)
//    for(i= 0; i < 999; i++)
    {
      k= x.split('\t');
//      k= dl[i].split('\t');
      
//      k[1]= k[1].substr(2);
      k[1]= k[1].replace(/[-]/gi, '');

      k[2]= k[2].toLowerCase();
      k[2]= k[2].replace(/[@]/gi, ':');
      k[2]= k[2].replace(/\n|\r|\t/gi, ' #');
      k[2]= k[2].replace(/\s+/g,' ').trim();

      if(k[2].length < 3 ||
         k[1].length < 5 || isNaN(k[1])) k[2]= '#';

      if(k[2] !== '#')
      { 
        hiTab.push([ +k[1], +k[0], k[2], '', 0 ]);
      }
    });

    sortem(curTab= 2, 1); reFresh();
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
        if(r !== 'P@lg')
        {
          adminInfo.innerText+= 'FAIL@server:'+ r +'\n';

          if(dbPass !== 'justWakingUpServer')
            $("#log4But").val('LogMe: wrong password, try again!');

          dbPass= '*';
          $('#pasIn').val('').focus();

          return;
        }
  
        adminInfo.innerText+= 
          x.getAllResponseHeaders() +'\n'+ 'PASS:logme logged \n';

        loadDB();
        isLogged= true;
        $('#log4But').css({background:'none', 'box-shadow':'none'});
        $('#log4But').val("Logged"); $('#pasIn').css({display:'none'});

        $('#hmPage').css({display:'none'});
        $('#appFrame').css({display:'block'});
        window.scrollTo(0,0);
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
//  loadDB();
  dbPass= 'justWakingUpServer';
  logMe();


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
  $('.mnu, .mtb, .ord, .ord2, .ord3, textarea').click(function(e) { e.stopPropagation(); });

  $("#mnu1").click(function()
  { // star A.
    if(curTab === 3) {
      adminInfo.innerText+= ' [?]Unused slot, haa... \n'; return; }
//    sRs= $('#ptb')[0].getElementsByClassName('selR');

    var js= '#htb>tr', tl= hiTab.length;
    if(curTab !== 2) { js= '#ptb>tr'; tl= plTab.length; }
    
    var er= edtRow[curTab] -1; //editRow-1;
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

    if(er >= 0 && er < tl ) // && eefmod[curTab === 0
    {
      var jj= $(js)[er];
      $(jj.firstChild).click();
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
    nBar.innerText= tblInf[curTab] +' [?]Press SPACE to toggle filter modes.'; }

  function ft1f()
  {
    var i, x, c1, c2, tn= 1, rf= 0, qs= '#t1in1';
    var inp= $(qs).val(), ts= Math.abs(tbSrt[tn])-1;

    fltNum[tn]++;
    fltInp[tn]= inp;
    var fn= fltNum[tn];
    for(i= 0; i < plTab.length; i++)
    {
      x= plTab[i];
      if(ts === 0)
      {
        c1= ''+x[0];
        c1= c1.indexOf(inp);
        if(tbFmod[tn] === 2) {
          if(c1 >= 0 && x[6]+1 >= fn) {
            rf++;
            x[6]= fn;
          }
        }
        else {
          if(c1 === 0 && x[6]+1 >= fn) {
            rf++;
            x[6]= fn;
          }
        }
      }
      else
      {
        c1= x[1].indexOf(inp);
        c2= x[2].indexOf(inp);
        if(ts > 2) {
          c1= x[3].indexOf(inp);
          c2= x[4].indexOf(inp);
        }
        if(tbFmod[tn] === 2) {
          if((c1 >= 0 || c2 >= 0) && x[6]+1 >= fn) {
            rf++;
            x[6]= fn;
          }
        }
        else {
          if((c1 === 0 || c2 === 0) && x[6]+1 >= fn) {
            rf++;
            x[6]= fn;
          }
        }
      }
    }
    recFil[1]= rf;
  }

  function ft2f()
  {
    var i, x, c1, tn= 2, rf= 0, qs= '#t2in1';
    var inp= $(qs).val(), ts= Math.abs(tbSrt[tn])-1;

    fltNum[tn]++;
    fltInp[tn]= inp.toLowerCase();

    var fn= fltNum[tn];
    for(i= 0; i < hiTab.length; i++)
    {
      x= hiTab[i];
      c1= ''+x[ts];
      c1= c1.indexOf(inp);

      if(tbFmod[tn] === 2) {
        if(c1 >= 0 && x[6]+1 >= fn) {
          rf++;
          x[6]= fn;
        }
      }
      else {
        if(c1 === 0 && x[6]+1 >= fn) {
          rf++;
          x[6]= fn;
        }
      }
    }
  }

  $('#t1fil, #t2fil').click(function(e)
  {//e.stopImmediatePropagation(); e.preventDefault();
    var tn= +this.id[1];
    if(tn !== 2) { tn= 1; ft1f(); } else ft2f();


    reFresh(); 

    if(tn !== 2) $('#t1in1')[0].focus();
    else { $("#mtb2").click(); $('#t2in1')[0].focus(); }
  });

  $('#t1clr, #t2clr').click(function(e)
  { //e.stopImmediatePropagation(); e.preventDefault();
    var js= '#t2in1', tn= +this.id[1];
    if(tn !== 2) { tn= 1; js= '#t1in1'; }

    fltNum[tn]= 0; fltStr[tn]= 'No Filters..';

    if(tn !== 2)
    {
      plTab.forEach(function(x) {
        x[6]= 0;
      });

      resetEdit(curTab);
      reFresh(); $(js)[0].focus();
      
      return;
    }

    hiTab.forEach(function(x) {
      x[4]= 0;
    });

    resetEdit(curTab);
    reFresh(); $("#mtb2").click(); $(js)[0].focus();
     
  });

  $('#t1in1, #t2in1').on('focus', function(e)
  {
    var i= +this.id[1]; if(i !== 2) i= 1;
    this.select(); //tbFmod[i]= 1;
    tiFresh(i); hntShow();
  });

  $('#t1in1, #t2in1').on('blur', function(e)
  { //e.stopImmediatePropagation(); e.preventDefault();
    var jq= $('#t2inf');
    var i= +this.id[1]; 
    if(i !== 2) { i= 1; jq= $('#t1inf'); }

    if(fltNum[i] > 0) jq.text(fltStr[i]);
    else jq.text('No Filters..');
  });

  $('#t1all, #t2all').click(function(e)
  {
//    nBar.innerText= ' [!]Please wait...'; nBar.focus();
    alert('This may take more than a few seconds!');
    tbAll[curTab]= 0; reFresh();
  });


  // *** INPUT TEXT FIELD ...............................
  $('#t1in1, #t2in1').on('keyup', function(e)
  {
    var a, tn= +this.id[1];
    if(tn !== 2) tn= 1;

    var t= this.value;
    if(t === ' ')
    {
      if(tbFmod[tn] !== 1) tbFmod[tn]= 1;
      else tbFmod[tn]= 2;

      tiFresh(tn); hntShow();
      this.value= '';
      return;
    }
    else
    if(t === '') { tbFmod[tn]= 1; tiFresh(tn); hntShow(); }
    else
    if(t.length === 1) nBar.innerText= tblInf[tn];

    a= Math.abs(tbSrt[tn]) -1;
    if(tn !== 2)
    { // *** tab1
      if(a === 1 || a === 2)
        this.value= t.toUpperCase().replace(/[^A-Z ]/gi, '');
      else
        this.value= t.toUpperCase().replace(/[^0-9]/g, '');
      return;
    }

    // *** tab2
    if(a > 1)
      this.value= t.toUpperCase().replace(/[^A-Z 0-9@,.:/-/+]/gi, '');
    else
      this.value= t.toUpperCase().replace(/[^0-9]/g, '');
  });

  $('.finf').on('keydown', function(e)
  {
    if(e.which !== 9 && e.which !== 13) return;
    $(this).next().click();
  });

// *** &&...
  $('.clPinf').on('keyup', function()
  {
    var ii= +this.id[3], tn= curTab;
    //jq= $('#t1inf');
    
    if(tn !== 2)
    { // *** tab1
      if(ii > 2)
      {
        //    $('#ta1mrg')[0].disabled= true;
        $('#ta1rmv')[0].disabled= true;
        $('#ta1sub')[0].disabled= false;
        this.value= this.value.toUpperCase().replace(/[^0-9]/g, '');
        return;
      }
      //    $('#ta1mrg')[0].disabled= true;
      $('#ta1rmv')[0].disabled= true;
      $('#ta1sub')[0].disabled= false;
      this.value= this.value.toUpperCase().replace(/[^A-Z \-]/gi, '');
      return;
    }
    // *** tab2
    
  });


  // *** TAB 1 : ADMIN BUTTONS **********************************
  $('#ta1rmv').click( //>Remove<
  function()
  {
  //  alert(0);
    var i, x, fnd= -1, cid= +$('#t1e0')[0].value;

    for(i= 0; i < plTab.length; i++)
    {
      x= plTab[i];
      if(x[0] === cid) { fnd= i; break; }
    }

    if(fnd >= 0)
    {
      fltNum[1]= 0; fltStr[1]= 'No Filters..';

      plTab.splice(fnd, 1);

      reFresh();
      
      $('#mtb1').click();
      nBar.innerText= ' [!]Deleted';
    }
    else
      nBar.innerText= ' [!]Not found';
  });

  $("#ta1sub").click(function()
  {
    var i, cid;
    fltNum[1]= 0; fltStr[1]= 'No Filters..';
    if(this.value[0] === 'N')
    { // *** NEW CLIENT
      $('#ta1sub').val('Confirm New');
      $('.clPinf').css({display:'inline'});

      $('#t1e0').val( nextID );
      $('#t1e1').focus();
    }
    else
    if(this.value[0] === 'C')
    { // *** CONFIRM NEW
      cid= eefmod[curTab]= nextID++;
      plTab.push([ cid, $('#t1e1')[0].value, $('#t1e2')[0].value,
                  $('#t1e3')[0].value, $('#t1e4')[0].value, '', 0 ]);

      sortem(curTab= 1, tbSrt[1])
      reFresh();

//      editRow= 1;
      edtRow[1]= 1;
      eefmod[1]= 0;
      $('#t1fil')[0].disabled= true;

      $('#mtb1').click();
    }
    else
    if(this.value[0] === 'E')
    { // *** EDIT CLIENT
      $('#ta1sub').val('Apply Edit');
      $('#ta1rmv')[0].disabled= true;
      $('.clPinf').css({display:'inline'});
      $('#t1e1').focus();
    }
    else
    if(this.value[0] === 'A')
    { // *** APPLY EDIT
      cid= eefmod[curTab]= +$('#t1e0')[0].value;
      for(i=0; i < plTab.length; i++)
      {
        if(plTab[i][0] === cid)
        { //nBar.innerText= 'Apply @'+ x[0] +':'+ x[1] +' '+ x[2];
          plTab[i][1]= $('#t1e1')[0].value;
          plTab[i][2]= $('#t1e2')[0].value;
          plTab[i][3]= $('#t1e3')[0].value;
          plTab[i][4]= $('#t1e4')[0].value
        }
      }

      curTab= 1;
      reFresh();

//      editRow= 1;
      edtRow[1]= 1;
      eefmod[1]= 0;
      $('#t1fil')[0].disabled= true;

      $('#mtb1').click();
    }

  });



  // *** TAB 2 : ADMIN BUTTONS **********************************
/*
  $("#rdt3But").click(function()
  { //>Re-Date<
    var nd= $('#dtEdit').val();
    $('#htb>tr')[editRow]
      .cells[0].innerText= hiTab[editRow][0]= +nd;
  });
  
  $('#rmr3But').click(function() { //>Remove<
    hiTab.splice(editRow, 1);
    reFresh(); });
*/
  
  // *** TAB 3 : ADMIN BUTTONS ***************************************
  $('#showPass').click(function() { //img>Show Password});
    $('#hmLog').css({display:'block'});
    window.scrollTo(0, 999);

    $('#pasIn').focus();
  });

  $("#log4But").click(function() { //>Log In<
    if(isLogged) return;
    dbPass= $('#pasIn').val();
    
    $("#log4But").val('Logging, please wait...');
    logMe();
  });
  
  // *** class="ord2" : DARK BOTTOM BUTTON
  $("#cad4But").click( function() { // >Cache Data<
    adminInfo.innerText+= '~inProgress...';
//    loadCache(false);
  });
  $("#imc4But").click( function() { // >Import Cache<
    adminInfo.innerText+= '~inProgress...';
//    ttxt= 'IMPORT'; loadCache(true);
  });
  $("#stc4But").click( function() { // >Store Cache<
    adminInfo.innerText+= '~inProgress...';
//    saveDB(true);
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

  $("#med4But").click(function()
  { //>Memory Data<
    var as= '~inProgress...';
/*
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
*/
    adminInfo.innerText+= as;
  });

  $("#sld4But").click( function() { loadDB(); }); //>Server Load<
  $("#ssv4But").click( function() {
    adminInfo.innerText+= '~inProgress...';
//    saveDB();
  }); //>Server Save<

}); // THE END
