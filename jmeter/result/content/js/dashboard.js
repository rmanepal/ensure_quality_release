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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9625, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Add User"], "isController": false}, {"data": [0.75, 500, 1500, "GET All Activities"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Book using variable"], "isController": false}, {"data": [1.0, 500, 1500, "Add CoverPhoto"], "isController": false}, {"data": [1.0, 500, 1500, "Add Users"], "isController": false}, {"data": [1.0, 500, 1500, "Get Book of specific ID"], "isController": false}, {"data": [0.75, 500, 1500, "Get All Authors"], "isController": false}, {"data": [1.0, 500, 1500, "Get Cover Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Get Books"], "isController": false}, {"data": [1.0, 500, 1500, "Get Books CSV"], "isController": false}, {"data": [1.0, 500, 1500, "Add Users from CSV"], "isController": false}, {"data": [1.0, 500, 1500, "Get Cover Photos By ID"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Book"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 40, 0, 0.0, 159.84999999999997, 53, 774, 378.0, 771.1999999999998, 774.0, 24.96878901373283, 376.0917749297753, 6.2287862827715355], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Add User", 4, 0, 0.0, 54.0, 53, 56, 56.0, 56.0, 56.0, 71.42857142857143, 22.739955357142858, 20.36830357142857], "isController": false}, {"data": ["GET All Activities", 2, 0, 0.0, 533.5, 330, 737, 737.0, 737.0, 737.0, 2.7137042062415193, 8.19941485753053, 0.48761872455902305], "isController": false}, {"data": ["Add New Book using variable", 2, 0, 0.0, 54.5, 54, 55, 55.0, 55.0, 55.0, 19.801980198019802, 7.387066831683168, 7.348391089108911], "isController": false}, {"data": ["Add CoverPhoto", 4, 0, 0.0, 57.25, 56, 61, 61.0, 61.0, 61.0, 40.40404040404041, 12.665719696969697, 12.507891414141413], "isController": false}, {"data": ["Add Users", 2, 0, 0.0, 54.0, 53, 55, 55.0, 55.0, 55.0, 29.41176470588235, 8.760340073529411, 8.44439338235294], "isController": false}, {"data": ["Get Book of specific ID", 4, 0, 0.0, 72.0, 61, 83, 83.0, 83.0, 83.0, 38.0952380952381, 27.56696428571429, 7.924107142857143], "isController": false}, {"data": ["Get All Authors", 4, 0, 0.0, 547.75, 321, 774, 774.0, 774.0, 774.0, 5.167958656330749, 160.10073481912144, 1.0749757751937985], "isController": false}, {"data": ["Get Cover Photos", 4, 0, 0.0, 56.5, 55, 57, 57.0, 57.0, 57.0, 39.603960396039604, 802.0962252475247, 8.392636138613861], "isController": false}, {"data": ["Get Books", 4, 0, 0.0, 350.0, 329, 380, 380.0, 380.0, 380.0, 10.526315789473683, 1001.5342310855264, 2.168996710526316], "isController": false}, {"data": ["Get Books CSV", 2, 0, 0.0, 63.5, 60, 67, 67.0, 67.0, 67.0, 25.31645569620253, 18.319818037974684, 5.266020569620253], "isController": false}, {"data": ["Add Users from CSV", 2, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 27.777777777777775, 8.27365451388889, 7.975260416666667], "isController": false}, {"data": ["Get Cover Photos By ID", 4, 0, 0.0, 54.25, 53, 56, 56.0, 56.0, 56.0, 53.333333333333336, 18.541666666666668, 11.40625], "isController": false}, {"data": ["Add New Book", 2, 0, 0.0, 55.0, 54, 56, 56.0, 56.0, 56.0, 24.096385542168676, 8.989081325301205, 8.942018072289157], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 40, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
