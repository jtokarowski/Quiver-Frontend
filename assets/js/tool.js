
(function inputScopeWrapper($) {

    $(function onDocReady() {

        // $('#searchForm').submit(fredSearch);
        $('#searchForm').on('submit', function (event) {
            event.preventDefault();
            fredSearch();
        })
        // $('#randomFoods').click(setInitialTable);
        // searchInput();

    });

    // Function that sends search key to backend to trigger search
    function fredSearch() {

        var input = document.getElementById("searchInput").value;
        console.log(input)

        // Send search term to backend to hit FRED API

        // Recieve resposne here - temp placeholder:

        // Test Data
        var searchResponse = [['title', 'frequency', 'frequency_short', 'observation_start', 'observation_end', 'tix']
            , ['title', 'frequency', 'frequency_short', 'observation_start', 'observation_end', 'tix']]

        searchHandler(searchResponse)

    }

    function searchHandler(searchData) {

        // Recieves response data from backend and then...

        // Clear table items
        tableItems = searchData;
        console.log(searchData)
        // Add search results to table
        createTable();
    }

    function createTable() {

        $("#outputTableBody").empty();

        var table_body = document.getElementById('outputTableBody');

        var tableSorted = tableItems
        // console.log(tableSorted)

        /////////////////////// LEFT OFF HERE - Make the search results table formatted to relevant results ////////////////

        for (i = 0; i < tableSorted.length; i++) {

            var tr = table_body.insertRow(-1)
            tr.id = tableSorted[i][6]
            tr.title = tableSorted[i][0]
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


    function searchInput() {

        var ApiKey = ''
        var searchPhrase = 'gold'
        var resultLimit = 5

        $.ajax({
            method: 'GET',
            url: 'https://api.stlouisfed.org/fred/series/search?file_type=json&limit=' + resultLimit + '&search_text=' + searchPhrase + '&api_key=' + ApiKey,
            success: searchResponse,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error pulling data: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
            }
        });
    }

    function searchResponse(response) {
        // console.log(response)
        // var searchResponseTable = response
        // console.log(searchResponseTable)
    }



    function setInitial(response) {
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
        for (i = 1; i < 11; i++) {
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








}(jQuery));



