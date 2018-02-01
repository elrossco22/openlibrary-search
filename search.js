var books = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace,
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: {
    url: 'http://openlibrary.org/search.json?title=%QUERY',
    wildcard: '%QUERY',
    filter: function (searchResults) {
        return $.map(searchResults.docs, function (searchResults) {
            if (JSON.parse(sessionStorage.getItem("selectedBooks") == undefined || JSON.parse(sessionStorage.getItem("selectedBooks").indexOf(searchResults.title)) == -1)){
             return {
                 title: searchResults.title,
                 key: searchResults.key,
             };
           }
        });
    }
  }
});
var authorsList = [];
var authors = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace,
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: {
    url: 'http://openlibrary.org/search.json?author=%QUERY',
    wildcard: '%QUERY',
    filter: function (searchResults) {
        return $.map(searchResults.docs, function (searchResults) {
            if (searchResults.author_name !== undefined){
              var author = searchResults.author_name.toString();
            } 
            if (authorsList.indexOf(author) == -1) {
              authorsList.push(author);
             return {
                 author_key: searchResults.author_key,
                 author: author,
             };
           }
        });
    },
  }
});
$('#multiple-datasets .typeahead').typeahead({
  highlight: true
},
{
  name: 'books',
  display: 'title',
  source: books,
  templates: {
    header: '<h3 class="search">Books</h3>'
  }
},
{
  name: 'authors',
  display: 'author',
  source: authors,
  templates: {
    header: '<h3 class="search">Authors</h3>'
  }
});

$('#multiple-datasets').bind('typeahead:selected', function(obj, datum, name) {    
       if (name == 'books'){
          var selectedBooks = JSON.parse(sessionStorage.getItem("selectedBooks"));
          if (selectedBooks == null){
            var a = [];
            a.push(datum.title);
            sessionStorage.setItem("selectedBooks", JSON.stringify(a));
          }else{
            selectedBooks.push(datum.title);
            sessionStorage.setItem("selectedBooks", JSON.stringify(selectedBooks));
          }

       }else if (name == 'authors'){

        var selectedAuthors = JSON.parse(sessionStorage.getItem("selectedAuthors"));
          if (selectedAuthors == null){
            var a = [];
            a.push(datum.author);
            sessionStorage.setItem("selectedAuthors", JSON.stringify(a));
          }else{
            selectedAuthors.push(datum.author);
            sessionStorage.setItem("selectedAuthors", JSON.stringify(selectedAuthors));
          }
       }
       $('.typeahead').typeahead('val','');
       update_lists(JSON.parse(sessionStorage.getItem("selectedAuthors")),JSON.parse(sessionStorage.getItem("selectedBooks")));
});

update_lists(JSON.parse(sessionStorage.getItem("selectedAuthors")),JSON.parse(sessionStorage.getItem("selectedBooks")));



function update_lists(Authors,Books) {
  $('#authorlist li').remove();
  $('#booklist li').remove();
  $.each(Authors, function(index,name) {
    $('#authorlist').append('<li>'+name+'</li>')
  });
  $.each(Books, function(index,name) {
    $('#booklist').append('<li>'+name+'</li>')
  });
}
