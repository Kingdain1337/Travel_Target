class City {
    constructor(name, imageUrl, description) {
        this.name = name;
        this.imageUrl = imageUrl;
        this.description = description;
    }
}

class Country {
    constructor(id, name, cities = []) {
        this.id = id;
        this.name = name;
        this.cities = cities;
    }

    addCity(city) {
        this.cities.push(city);
    }
}

class Temple {
    constructor(id, name, imageUrl, description) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.description = description;
    }
}

class Beach {
    constructor(id, name, imageUrl, description) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.description = description;
    }
}

class Search_Result{
    constructor(name, imageUrl , description, priority) {
        this.name = name;
        this.imageUrl = imageUrl;
        this.description = description
        this.priority = priority;
    }
}

var data;

fetch('travel_recommendation_api.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(returnData => {

        data = returnData;

        const countries = data.countries.map(countryData => {
            const cities = countryData.cities.map(cityData => new City(cityData.name, cityData.imageUrl, cityData.description));
            return new Country(countryData.id, countryData.name, cities);
        });

        const temples = data.temples.map(templeData => new Temple(templeData.id, templeData.name, templeData.imageUrl, templeData.description));

        const beaches = data.beaches.map(beachData => new Beach(beachData.id, beachData.name, beachData.imageUrl, beachData.description));

        console.log(countries, temples, beaches);
    })
    .catch(error => console.error('Error fetching data:', error));

    document.getElementById('searchButton').addEventListener('click', search);
    document.getElementById('clearButton').addEventListener('click', clear);

    document.getElementById('searchInput').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            search();
        }
    });

    function sanitizeInput(input) {
        const sanitizedInput = input.replace(/[<>\/\\'";]/g, '').trim().toLowerCase();
        return sanitizedInput.endsWith('es') ? sanitizedInput.slice(0, -2) : sanitizedInput.endsWith('s') ? sanitizedInput.slice(0, -1) : sanitizedInput;
    }

    function search() {
        const searchInput = document.getElementById('searchInput').value;
        const sanitizedSearchInput = sanitizeInput(searchInput);
        
        if (!sanitizedSearchInput) {
            alert("Please enter a search term.");
            return;
        }
        
        const results = [];
    
        // Process countries and cities
        if('country'.includes(sanitizedSearchInput)){
            data.countries.forEach(country =>{
                country.cities.forEach(city => results.push(new Search_Result(city.name, city.imageUrl, city.description, 1)))
            })
        } else{
            data.countries.forEach(country => {
                if (country.name.toLowerCase().includes(sanitizedSearchInput)) {
                    country.cities.forEach(city => {
                        results.push(new Search_Result(city.name, city.imageUrl, city.description, 2));
                    });
                } else {
                    country.cities.forEach(city => {
                        if (city.name.toLowerCase().includes(sanitizedSearchInput)) {
                            results.push(new Search_Result(city.name, city.imageUrl, city.description, 3));
                        } else if (city.description.toLowerCase().includes(sanitizedSearchInput)) {
                            results.push(new Search_Result(city.name, city.imageUrl, city.description, 4));
                        }
                    });
                }
            });
  
        }

        // Process temples
        if('temple'.includes(sanitizedSearchInput)){
            data.temples.forEach(temple => results.push(new Search_Result(temple.name, temple.imageUrl, temple.description, 1)))
        }else{
            data.temples.forEach(temple => {
                if (temple.name.toLowerCase().includes(sanitizedSearchInput)) {
                    results.push(new Search_Result(temple.name, temple.imageUrl, temple.description, 2));
                } else if (temple.description.toLowerCase().includes(sanitizedSearchInput)) {
                    results.push(new Search_Result(temple.name, temple.imageUrl, temple.description, 3));
                }
            }); 
        }


        // Process beaches
        if('beach'.includes(sanitizedSearchInput)){
            data.beaches.forEach(beach => results.push(new Search_Result(beach.name, beach.imageUrl, beach.description, 1)))
        }else{
            data.beaches.forEach(beach => {
                if (beach.name.toLowerCase().includes(sanitizedSearchInput)) {
                    results.push(new Search_Result(beach.name, beach.imageUrl, beach.description, 2));
                } else if (beach.description.toLowerCase().includes(sanitizedSearchInput)) {
                    results.push(new Search_Result(beach.name, beach.imageUrl, beach.description, 3));
                }
            }); 
        }
 

        // Sort the results by priority
        results.sort((a, b) => a.priority - b.priority);

    
        // Display the results
        displayResults(results);
    }

    function displayResults(results) {
        console.log('results :' + results)
        const searchResultsDiv = document.getElementById('searchResults');
        searchResultsDiv.style.display = 'block';

        const insertionPointDiv = document.getElementById('insertion_point');
        insertionPointDiv.innerHTML = ''; // Clear previous results
    
        if (results.length === 0) {
            insertionPointDiv.innerHTML = '<p>No results found.</p>';
            return;
        }
    
        results.forEach(result => {
            const resultDiv = document.createElement('div');
            resultDiv.classList.add('search-result');
    
            const img = document.createElement('img');
            img.src = result.imageUrl;
            img.alt = result.name;
            resultDiv.appendChild(img);
    
            const name = document.createElement('h3');
            name.textContent = result.name;
            resultDiv.appendChild(name);
    
            const description = document.createElement('p');
            description.textContent = result.description;
            resultDiv.appendChild(description);
    
            insertionPointDiv.appendChild(resultDiv);
        });
    }
    
    function clear(){
        const insertionPointDiv = document.getElementById('insertion_point');
        insertionPointDiv.innerHTML = '';
        const searchResultsDiv = document.getElementById('searchResults');
        searchResultsDiv.style.display = 'none';
    }
