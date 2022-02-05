
(function inputScopeWrapper($) {


    // Grab the dietDB data during page load
    $(function onDocReady() {

        var keyProd = 'AIzaSyDaqR3scLgh4Dw26glrQ2BfDHiMJKzDIz4'
        var keyTest = 'AIzaSyAGYgfzU5Lo2-OsFVMySI7UNzjxl_4EkQQ' ///////////////////////////////////////// Make sure right one active pre-commit

        $.ajax({
            method: 'GET',
            url: 'https://sheets.googleapis.com/v4/spreadsheets/1e1xYZZx8uQ788Sq5hOrPg8ggTdYZWgb_fgs05yP516w/values/Output!A1:E7084?majorDimension=ROWS&key=' + keyTest,
            // contentType: 'application/json',
            success: setInitial,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error pulling data: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                // alert('An error occured when pulling the diet DB:\n' + jqXHR.responseText);
            }
        });

        // $('#buttonModel').click(dietModel);
        $('#searchInput').keyup(tableSearch);
        $('#randomFoods').click(setInitialTable);

    });

    function setInitial(response) {
        // Filter out excluded items
        foodDB = response.values.filter(item => item.length > 0)
        // console.log(foodDB)
        // Set initial foods list
        yourFoods = ['32202025', '61210010', '24208500', '56203085', '32130440', '27540310', '27510551', '27446360', '13120730']

        yourFoodsTable();
        setInitialTable();

    }

    var grades = ['A', 'B', 'C', 'D', 'F']
    var colors = ['darkgreen', 'yellowgreen', 'gold', 'orange', 'red']

    function yourFoodsTable() {
        // clear list
        $("#compList").empty();

        var compListItems = [];
        for (i = 0; i < yourFoods.length; i++) {
            var index = foodDB.findIndex((e) => e[4] == yourFoods[i])
            var food = foodDB[index][0]
            var grade = foodDB[index][3]
            var score = foodDB[index][2]
            var id = yourFoods[i]
            var colorIndex = grades.findIndex((e) => e == grade)
            var color = colors[colorIndex]
            var newItem = '<li class="w3-display-container" style="display: flex;cursor: pointer;" id="' + id + '"; title="' + score + '"><span style="margin: auto; margin-left: 0; margin-right: 10px;">' + food + '</span><span style="margin: auto; color: ' + color + '; margin-right: 0px;">' + grade + '</span></li>';
            compListItems.push([score, newItem])
            // var newItem = '<li class="w3-display-container" style="display: flex;" onclick="this.style.display=&quot;none&quot;" id="' + id + '"; title="' + score + '"><span style="margin: auto; margin-left: 0; margin-right: 10px;">' + food + '</span><span style="margin: auto; color: ' + color + '; margin-right: 0px;">' + grade + '</span></li>';
            // $("#compList").append(newItem);
        }

        // Rank list by score descending
        var compListSorted = compListItems.sort(function (a, b) {
            return b[0] - a[0];
        });
        // Then push list
        for (i = 0; i < compListSorted.length; i++) {
            $("#compList").append(compListSorted[i][1]);
        }


        document.querySelectorAll('li').forEach(item => {
            // console.log(item)
            if (item.className == 'w3-display-container') {
                item.addEventListener('click', function () {
                    yourFoods = yourFoods.filter(x => x != item.id);
                    item.remove();
                })
            }
        })

        // setInitialTable();
        // createTable();
    }

    // Sets random list of foods
    function setInitialTable() {
        // Create array of items 
        tableItems = [];
        for (i = 1; i < 21; i++) {
            // Random items
            var index = Math.trunc(Math.random() * 6000)
            if (!yourFoods.includes(foodDB[index][4])) {
                var food = foodDB[index][0]
                var category = foodDB[index][1]
                var score = foodDB[index][2]
                var grade = foodDB[index][3]
                var colorIndex = grades.findIndex((e) => e == grade)
                var color = colors[colorIndex]
                var id = foodDB[index][4]
                tableItems.push([index, food, category, score, grade, color, id])
            }
        }

        createTable();

    }

    function tableSearch() {

        // Declare variables
        // var input, filter, table, tr, td, i, txtValue;
        var input = document.getElementById("searchInput");
        var filter = input.value.toUpperCase();
        // table = document.getElementById("myTable");
        // tr = table.getElementsByTagName("tr");
        // food

        // Clear table items
        tableItems = [];

        // Loop through all table rows, and hide those who don't match the search query
        for (i = 1; i < foodDB.length; i++) {
            var name = foodDB[i][0].toUpperCase();
            if (name.includes(filter)) {
                if (!yourFoods.includes(foodDB[i][4])) {
                    var colorIndex = grades.findIndex((e) => e == foodDB[i][3])
                    var color = colors[colorIndex]
                    tableItems.push([i, foodDB[i][0], foodDB[i][1], foodDB[i][2], foodDB[i][3], color, foodDB[i][4]])
                }
            }
            if (tableItems.length == 20) {
                break;
            }

        }

        // console.log(tableItems)

        // document.getElementById('outputTableBody').remove();
        // $("#outputTableBody").empty();
        createTable();


    }



    function createTable() {

        $("#outputTableBody").empty();

        var table_body = document.getElementById('outputTableBody');

        // Sort table items from highest score to lowest
        var tableSorted = tableItems.sort(function (a, b) {
            return b[3] - a[3];
        });


        // console.log(tableSorted)

        for (i = 0; i < tableSorted.length; i++) {

            var tr = table_body.insertRow(-1)
            tr.id = tableSorted[i][6]
            tr.title = tableSorted[i][3]
            tr.style.cursor = "pointer"
            var tc = tr.insertCell(-1)
            tc.innerHTML = tableSorted[i][1]
            var tc = tr.insertCell(-1)
            tc.innerHTML = tableSorted[i][2]
            var tc = tr.insertCell(-1)
            tc.innerHTML = tableSorted[i][4]
            tc.style.fontWeight = '900'
            tc.style.color = tableSorted[i][5]
        }

        // Add listener to table items
        document.querySelectorAll('tr').forEach(item => {
            // console.log(item.parentElement.tagName)
            if (item.parentElement.tagName == 'TBODY')
                // console.log(item)
                item.addEventListener('click', function () {
                    yourFoods.push(item.id)
                    // Hide row
                    item.style.display = 'none';
                    // Re run the your foods script
                    yourFoodsTable();
                })
        })




    }




}(jQuery));



