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
    cell.colSpan = 7;
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

    var data = {"OkPercent": 98.65079365079364, "KoPercent": 1.3492063492063493};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.009829059829059829, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "news"], "isController": true}, {"data": [0.011111111111111112, 500, 1500, "https://www.banglapuzzle.com/about"], "isController": false}, {"data": [0.013888888888888888, 500, 1500, "hire"], "isController": true}, {"data": [0.0, 500, 1500, "https://www.banglapuzzle.com/services"], "isController": false}, {"data": [0.0, 500, 1500, "products"], "isController": true}, {"data": [0.013888888888888888, 500, 1500, "https://www.banglapuzzle.com/industry/healthcare"], "isController": false}, {"data": [0.013888888888888888, 500, 1500, "healthcare"], "isController": true}, {"data": [0.027777777777777776, 500, 1500, "https://www.banglapuzzle.com/news"], "isController": false}, {"data": [0.013888888888888888, 500, 1500, "https://www.banglapuzzle.com/hire"], "isController": false}, {"data": [0.0, 500, 1500, "service"], "isController": true}, {"data": [0.016666666666666666, 500, 1500, "contact"], "isController": true}, {"data": [0.0, 500, 1500, "https://www.banglapuzzle.com/products"], "isController": false}, {"data": [0.016666666666666666, 500, 1500, "https://www.banglapuzzle.com/contact"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1260, 17, 1.3492063492063493, 71363.00873015875, 895, 2162782, 35115.0, 77657.7, 121122.80000000006, 2154374.14, 0.5453376873786786, 87.37322454171077, 0.6160624367018755], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["news", 180, 0, 0.0, 78173.95555555559, 1821, 457161, 65474.5, 143936.60000000003, 169211.59999999992, 440551.94999999995, 0.08331138695408478, 23.35131664824174, 0.20673265063508733], "isController": true}, {"data": ["https://www.banglapuzzle.com/about", 180, 0, 0.0, 44373.0388888889, 895, 407782, 43585.5, 71292.20000000001, 79833.49999999997, 224063.46999999948, 0.08361231200584543, 12.101654197738704, 0.10378051617131791], "isController": false}, {"data": ["hire", 180, 0, 0.0, 45483.22222222225, 963, 339922, 52793.5, 74415.7, 85418.29999999999, 199358.64999999962, 0.08425305686472845, 13.610536927910044, 0.10449353732246594], "isController": true}, {"data": ["https://www.banglapuzzle.com/services", 180, 1, 0.5555555555555556, 38066.0611111111, 1624, 2089673, 14828.0, 66483.40000000002, 82046.9, 717010.5499999961, 0.08311646093803392, 15.82521498231351, 0.09810601322775388], "isController": false}, {"data": ["products", 180, 15, 8.333333333333334, 237683.2388888889, 7459, 2162782, 36782.5, 413108.4, 2156536.45, 2162552.77, 0.08320752048060664, 10.594670660155755, 0.04282939184894507], "isController": true}, {"data": ["https://www.banglapuzzle.com/industry/healthcare", 180, 1, 0.5555555555555556, 50103.13888888889, 995, 2089893, 23641.0, 72293.40000000001, 99127.59999999993, 726997.5299999962, 0.08344788100332169, 15.323006229471243, 0.10413554876833246], "isController": false}, {"data": ["healthcare", 180, 1, 0.5555555555555556, 50103.13888888889, 995, 2089893, 23641.0, 72293.40000000001, 99127.59999999993, 726997.5299999962, 0.08344788100332169, 15.323006229471243, 0.10413554876833246], "isController": true}, {"data": ["https://www.banglapuzzle.com/news", 180, 0, 0.0, 33800.916666666664, 926, 451525, 17743.5, 72235.7, 83695.59999999998, 282032.49999999953, 0.08342718892086932, 11.308914387047697, 0.10346926750928127], "isController": false}, {"data": ["https://www.banglapuzzle.com/hire", 180, 0, 0.0, 45483.22222222225, 963, 339922, 52793.5, 74415.7, 85418.29999999999, 199358.64999999962, 0.08425301742820472, 13.610530557194458, 0.1044934884119336], "isController": false}, {"data": ["service", 180, 1, 0.5555555555555556, 38066.0611111111, 1624, 2089673, 14828.0, 66483.40000000002, 82046.9, 717010.5499999961, 0.08311630741951571, 15.825185752681657, 0.0981058320230971], "isController": true}, {"data": ["contact", 180, 0, 0.0, 50031.45000000001, 981, 297400, 57506.5, 75980.5, 89264.44999999991, 176756.97999999966, 0.08355490857236227, 14.901750488390046, 0.10387245958263396], "isController": true}, {"data": ["https://www.banglapuzzle.com/products", 180, 15, 8.333333333333334, 237683.2333333333, 7459, 2162782, 36782.0, 413108.4, 2156536.45, 2162552.77, 0.08321352127261211, 10.595434730694462, 0.04283248063552015], "isController": false}, {"data": ["https://www.banglapuzzle.com/contact", 180, 0, 0.0, 50031.45000000001, 981, 297400, 57506.5, 75980.5, 89264.44999999991, 176756.97999999966, 0.08355498614379814, 14.90176432300733, 0.10387255601665529], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Software caused connection abort: recv failed", 16, 94.11764705882354, 1.2698412698412698], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.banglapuzzle.com:443 failed to respond", 1, 5.882352941176471, 0.07936507936507936], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1260, 17, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Software caused connection abort: recv failed", 16, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.banglapuzzle.com:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.banglapuzzle.com/services", 180, 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Software caused connection abort: recv failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.banglapuzzle.com/industry/healthcare", 180, 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Software caused connection abort: recv failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.banglapuzzle.com/products", 180, 15, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Software caused connection abort: recv failed", 14, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.banglapuzzle.com:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
