/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 6;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9455645161290323, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Add User"], "isController": false}, {"data": [0.825, 500, 1500, "GET All Activities"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Book using variable"], "isController": false}, {"data": [1.0, 500, 1500, "Add CoverPhoto"], "isController": false}, {"data": [1.0, 500, 1500, "Add Users"], "isController": false}, {"data": [1.0, 500, 1500, "Get Book of specific ID"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "Get All Authors"], "isController": false}, {"data": [1.0, 500, 1500, "Get Cover Photos"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "Get Books"], "isController": false}, {"data": [1.0, 500, 1500, "Get Books CSV"], "isController": false}, {"data": [1.0, 500, 1500, "Add Users from CSV"], "isController": false}, {"data": [1.0, 500, 1500, "Get Cover Photos By ID"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Book"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 248, 0, 0.0, 181.83467741935485, 49, 1084, 555.4, 758.6999999999998, 1003.8299999999988, 3.108119963404394, 49.628115365454754, 0.7683770138549461], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Add User", 24, 0, 0.0, 81.58333333333333, 50, 361, 196.5, 353.5, 361.0, 0.30764103418660993, 0.09794040736800276, 0.08772576365477548], "isController": false}, {"data": ["GET All Activities", 20, 0, 0.0, 422.0, 212, 765, 741.7000000000002, 764.25, 765.0, 0.25552574421873003, 0.7758100964609684, 0.04591478216430306], "isController": false}, {"data": ["Add New Book using variable", 12, 0, 0.0, 53.41666666666667, 51, 56, 55.7, 56.0, 56.0, 0.15382643250865272, 0.05738446993975131, 0.057084027688757845], "isController": false}, {"data": ["Add CoverPhoto", 24, 0, 0.0, 55.375, 51, 60, 60.0, 60.0, 60.0, 0.3061810295337118, 0.09598057664093895, 0.0947845569943229], "isController": false}, {"data": ["Add Users", 12, 0, 0.0, 55.24999999999999, 52, 68, 65.00000000000001, 68.0, 68.0, 0.15320778806255986, 0.045633179061602296, 0.043987392275774015], "isController": false}, {"data": ["Get Book of specific ID", 24, 0, 0.0, 60.49999999999999, 55, 69, 67.0, 68.5, 69.0, 0.30612244897959184, 0.22148288026147958, 0.06367586096938775], "isController": false}, {"data": ["Get All Authors", 24, 0, 0.0, 489.25, 271, 833, 821.0, 832.5, 833.0, 0.30617321749779935, 13.548115041397171, 0.06368642121780398], "isController": false}, {"data": ["Get Cover Photos", 24, 0, 0.0, 69.08333333333334, 52, 151, 103.5, 139.5, 151.0, 0.30615759462183156, 6.2005882371700825, 0.06487909964154048], "isController": false}, {"data": ["Get Books", 24, 0, 0.0, 578.7916666666667, 299, 1084, 1002.5, 1080.25, 1084.0, 0.30531632042947826, 29.07409943611892, 0.06291185899474601], "isController": false}, {"data": ["Get Books CSV", 12, 0, 0.0, 61.00000000000001, 56, 66, 65.7, 66.0, 66.0, 0.15362359658443536, 0.11120458102364524, 0.031967410194205834], "isController": false}, {"data": ["Add Users from CSV", 12, 0, 0.0, 53.833333333333336, 51, 58, 57.7, 58.0, 58.0, 0.1536452331566413, 0.04576347276638242, 0.044112986863332565], "isController": false}, {"data": ["Get Cover Photos By ID", 24, 0, 0.0, 53.875, 49, 61, 59.5, 60.75, 61.0, 0.30617321749779935, 0.10644303264571932, 0.06548040491408014], "isController": false}, {"data": ["Add New Book", 12, 0, 0.0, 54.166666666666664, 52, 57, 57.0, 57.0, 57.0, 0.15333111855050985, 0.05719969461552222, 0.05690021977460326], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 248, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
