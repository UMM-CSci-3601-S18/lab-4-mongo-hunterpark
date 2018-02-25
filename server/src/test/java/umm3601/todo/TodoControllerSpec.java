package umm3601.todo;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class TodoControllerSpec {
    private TodoController todoController;
    private ObjectId samId;

    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> userDocuments = db.getCollection("todos");
        userDocuments.drop();
        List<Document> testTodos = new ArrayList<>();
        testTodos.add(Document.parse("{\n" +
            "                    owner: \"Hunter\",\n" +
            "                    status: true,\n" +
            "                    body: \"in class\",\n" +
            "                    category: \"3601\"\n" +
            "                }"));
        testTodos.add(Document.parse("{\n" +
            "                    owner: \"Sunjae\",\n" +
            "                    status: false,\n" +
            "                    body: \"walks to school\",\n" +
            "                    category: \"homework\"\n" +
            "                }"));
        testTodos.add(Document.parse("{\n" +
            "                    owner: \"Nic\",\n" +
            "                    status: true,\n" +
            "                    body: \"walks to school\",\n" +
            "                    category: \"exercise\"\n" +
            "                }"));

        samId = new ObjectId();
        BasicDBObject sam = new BasicDBObject("_id", samId);
        sam = sam.append("owner", "Sam")
            .append("status", false)
            .append("body", "go to class")
            .append("category", "3601");



        userDocuments.insertMany(testTodos);
        userDocuments.insertOne(Document.parse(sam.toJson()));

        // It might be important to construct this _after_ the DB is set up
        // in case there are bits in the constructor that care about the state
        // of the database.

        todoController = new TodoController(db);
    }

    // http://stackoverflow.com/questions/34436952/json-parse-equivalent-in-mongo-driver-3-x-for-java
    private BsonArray parseJsonArray(String json) {
        final CodecRegistry codecRegistry
            = CodecRegistries.fromProviders(Arrays.asList(
            new ValueCodecProvider(),
            new BsonValueCodecProvider(),
            new DocumentCodecProvider()));

        JsonReader reader = new JsonReader(json);
        BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

        return arrayReader.decode(reader, DecoderContext.builder().build());
    }

    private static String getOwner(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("owner")).getValue();
    }


    @Test
    public void getAllTodos() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = todoController.getTodos(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 todos", 4, docs.size());
        List<String> names = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedOwners = Arrays.asList("Hunter", "Nic", "Sam", "Sunjae");
        assertEquals("Owners should match", expectedOwners, names);
    }

    @Test
    public void getTodosWhoAreIncomplete() {
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("status", new String[] { "false" });
        String jsonResult = todoController.getTodos(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 2 todos", 2, docs.size());
        List<String> owners = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedOwners = Arrays.asList("Sam", "Sunjae");
        assertEquals("Owners should match", expectedOwners, owners);
    }

    @Test
    public void getJohnByID() {
        String jsonResult = todoController.getTodo(samId.toHexString());
        Document john = Document.parse(jsonResult);
        assertEquals("Owner should match", "Sam", john.get("owner"));
        String noJsonResult = todoController.getTodo(new ObjectId().toString());
        assertNull("No owner should match",noJsonResult);

    }

    /* COME BACK TO LATER

    @Test
    public void addTodoTest(){
        boolean bool = todoController.addNewTodo("KK",  false, "Teaches 3601", "class");

        assertTrue("Add new todo should return true when todo is added,",bool);
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("owner", new String[] { "Sam" });
        String jsonResult = todoController.getTodos(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> owner = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        assertEquals("Should return owner of new Todo", "Sam", owner.get(0));
    }

    */

    @Test
    public void getTodoByCategory(){
        Map<String, String[]> argMap = new HashMap<>();
        //Mongo in TodoController is doing a regex search so can just take a Java Reg. Expression
        //This will search the category containing an m or c
        argMap.put("category", new String[] { "[6,1]" });
        String jsonResult = todoController.getTodos(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        assertEquals("Should be 2 todos", 2, docs.size());
        List<String> owner = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedOwner = Arrays.asList("Hunter", "Sam");
        assertEquals("Owners should match", expectedOwner, owner);

    }

    @Test
    public void getTodoByBody(){
        Map<String, String[]> argMap = new HashMap<>();
        //Mongo in TodoController is doing a regex search so can just take a Java Reg. Expression
        //This will search the bodies containing "ea"
        argMap.put("body", new String[] { "oo" });
        String jsonResult = todoController.getTodos(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        assertEquals("Should be 2 todo", 2, docs.size());
        List<String> owner = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedOwner = Arrays.asList("Nic","Sunjae");
        assertEquals("Owners should match", expectedOwner, owner);

    }

    @Test
    public void getTodoByOwner(){
        Map<String, String[]> argMap = new HashMap<>();
        //Mongo in TodoController is doing a regex search so can just take a Java Reg. Expression
        //This will search the owners containing "i"
        argMap.put("owner", new String[] { "a" });
        String jsonResult = todoController.getTodos(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        assertEquals("Should be 2 todos", 2, docs.size());
        List<String> owner = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedOwner = Arrays.asList("Sam", "Sunjae");
        assertEquals("Owners should match", expectedOwner, owner);

    }


}
