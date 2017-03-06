//////////////////////////////
///// 1. getJSON
//////////////////////////////

var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "json";
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
};

//////////////////////////////
///// 2. getElementByXpath
//////////////////////////////

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

//////////////////////////////
///// 3. Main
//////////////////////////////

if (document.title.indexOf("GEO Accession viewer") != -1) {
  
    gse = document.body.innerHTML.match(/GSE([0-9]+)/g)[1];
    
    getJSON("http://amp.pharm.mssm.edu/awsscheduler/getGSEmatrix.php?gse="+gse,
      function(err, data) {
        if (err != null) {
        
        } else {
          var aTags = document.getElementsByTagName("a");
          var searchText = "Series Matrix File(s)";
          var found;

          for (var i = 0; i < aTags.length; i++) {
            if (aTags[i].textContent == searchText) {
              found = aTags[i];
              break;
            }
          }
          
          if(data.link != ""){
            found.href = data.link;
            var description = 'Available FASTQ files were extracted from the SRA database and aligned against the Ensembl references using Kallisto (GRCh38.cdna.all for human data, GRCm38.cdna.all for mouse data).  Sample profiles were built by adding all gene counts from corresponding SRA level gene counts. For each series we build Series Matrix Files containing sample meta information as well as gene counts.';
            found.parentNode.innerHTML = "<div style='display:table;'><img src='"+chrome.extension.getURL("icons/icon_128.png")+"' class='archs-logo'></img><b class='count-label'>Now with counts!</b><div class='archs-tooltip'><img src='"+chrome.extension.getURL("icons/help.png")+"' class='archs-help'><div class='archs-tooltip-text'>" + description + "</div></div></div>"+found.parentNode.innerHTML+"<br><br>";
            var div = document.createElement('div');
            div.innerHTML = "<br><div><div class='heatmap-title'>Sample Expression Heatmap</div><div class='heatmap-description'>The following heatmap displays the normalized expression levels of the top 1000 most variable genes in the dataset with Clustergrammer.  For more information about Clustergrammer, please visit the tool's <a href='http://amp.pharm.mssm.edu/clustergrammer/'>homepage</a> or read the <a href='https://clustergrammer.readthedocs.io/'>documentation</a>.</div></div><iframe frameborder=0 src=\""+data.clustergrammer+"\" width=800px height=600px style='padding: 5px 10px;'></iframe>";
            document.getElementById('customDlArea').appendChild(div); 
            
          }

        }
    });

}