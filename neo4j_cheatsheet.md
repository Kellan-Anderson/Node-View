### NEO4J CHEATSHEET

## Nodes

# CREATE (n)
 - create an empty node

# MATCH (n) RETURN (n)
 - Display all nodes of (n) type

# MATCH (n) DELETE (n)
 - Delete all nodes of (n) type

# CREATE (n:Person)
 - Create node of type Person

# MATCH (n:person) RETURN (n)
 - Only return that type of node

# MATCH (n:person) RETURN (n) LIMIT 1
 - Only return 1 school

# CREATE (n:Person{name:'chris', favoritecolor:'orange'})
 - Add traits, properties, etc

## Relationships

# MATCH (s:School), (p:Person)
# WHERE s.name = 'LSU' AND p.name = 'jenny'
# CREATE (p)-[stu:STUDIED_AT]->(s) 
 - Create and define a relationship between two nodes 
 
 MATCH (l:Licit), (i:Illicit)
 WHERE l.id = '' AND i.id = ''
 CREATE (l)-[con:CONNECTED]->(i)
 
 MATCH (i:Illicit), (l:Licit)
 WHERE i.id = '' AND l.id = ''
 CREATE (i)-[con:CONNECTED]->(l)
 
 MATCH (l:Licit), (l:Licit)
 WHERE l.id = '' AND l.id = ''
 CREATE (l)-[con:CONNECTED]->(l)
 
 MATCH (i:Illicit), (i:Illicit)
 WHERE i.id = '' AND i.id = ''
 CREATE (i)-[con:CONNECTED]->(i)
