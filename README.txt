To setup virtual enviroment on wsl or linux for backend run:
    python3 -m venv .venv

To start the virtual enviroment run:
    source .venv/bin/activate

To install the required packages run:
    pip install -r backend/requirements.txt

While in the backend folder and the virtual enviroment running, to run the 
backend test webpage run:
    python manage.py runserver
    Navigate to localhost:8000 in a browser to see the webpage

While in the frontend folder, to run the test webpage run:
    npm start
    Navigate to localhost:3000 in a browser to see the webpage

Database setup:
    This project uses Neo4j as a database. The React frontend contacts the 
    database over the localhost and uses a preset driver with the feilds 
    defined in the main index.js file. To use a different database these values
    will need to be changed 