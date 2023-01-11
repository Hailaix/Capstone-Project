# Capstone project proposal

1. What tech stack will you use for your final project?

    For the tech stack, I will be using React and Express with a Postgres database to form the front and backend of this app. I will also likely be using Redux to store information retrieved from the database and external API to reduce the number of times they are accessed during a session.

1. Is the front-end UI or the back-end going to be the focus of your project?

    The front end will likely be focused on more than the backend for this project, though I imagine that I will also be spending some time on the backend.

1. Will this be a website? A mobile app? Something else?

    This will likely wind up being a website, although it is possible that the concept could be extended to a mobile app.

1. What goal will your project be designed to achieve?

    The goal of this app is to allow users to share their interests in books; what they have been reading, what they recommend, that sort of thing. It should be a place to share a hobby with others that might enjoy it.

1. What kind of users will visit your app?

    The primary demographic would be people who enjoy reading as a hobby, as well as people looking
    to try new books, who will use the app to find new recommendations.

1. What data do you plan on using?

    The data I plan on using is the data on individual books and series, most likely coming from google’s books API. What will be retrieved should be the basic information about the book, such as its title, author and a short description, alongside other things. Afterwards, users of the app can add reviews to the book or add it to a reading list.

1. In brief, outline your approach to reacting your project (knowing that you may not know everything in advance and that these details might change later)
    - What does your database schema look like?

        A brief overview of what I expect the database to look like is a table of users, who can have many reading lists, which contain many books, which have reviews made by many users. Obviously subject to change depending on circumstances, and I am still not fully sure what to include as far as details on the books and what information might be needed under the users.
    - What kinds of issues might you run into with your API?

        The google books API has a lot of additional features and functionality that is unnecessary for what I intend to use it for. Some issues might stem from trying to figure out exactly what information I need from the API and how to filter it out from the rest.
    - Is there any sensitive information you need to secure?

        The login information for any users of the site, as well as the API key needed to access the google books API. Other than that, I do not believe anything needs to be secured.
    - What functionality will your app include?

        The app should allow users to sign up for an account, which will allow them to start putting books into reading lists and leaving reviews for books. The books should be able to be searched for by title or author, and it should be possible to see what reading lists that the book is a part of.
    - What will the user flow look like?

        imilar to the outline above, users will login and be put on either a search page or their account page. They can then search for a book and either place it in a reading list, create a new reading list with that book, or leave a review for the book. Additionally, they can view reading lists that the book is already a part of, in order to find new books to try.
    - What features make your site more than a CRUD app? What are your stretch goals?

        As far as stretch goals go, the google books API also has a location based service that indicates where books can be acquired near your location, which might be an interesting inclusion if possible.
