# Chart Script
# Aidan Kirk

# Imports
import json
import random
import pandas as pd
from IPython.display import display

# Choose file
data = json.load(open('/home/aidankirk/Code/scripting/baba.json'))

# Load into pandas and separate keys into tables
df = pd.json_normalize(data, record_path="links")

# Display dataframe
display(df)

# Group our timestamps by number and count how many occurences there are
df.groupby('timestamp').count()


