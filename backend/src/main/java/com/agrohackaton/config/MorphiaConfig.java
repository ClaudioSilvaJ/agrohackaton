package com.agrohackaton.config;

import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.Morphia;
import com.mongodb.MongoClient;

public class MorphiaConfig {
    final Datastore datastore;

    public MorphiaConfig(String databaseName) {
        MongoClient mongoClient = new MongoClient("localhost", 27037);
        Morphia morphia = new Morphia();
        morphia.mapPackage("com.agrohackaton");
        datastore = morphia.createDatastore(mongoClient, databaseName);
        datastore.ensureIndexes();
    }

    public Datastore getDatastore() {
        return datastore;
    }
}
