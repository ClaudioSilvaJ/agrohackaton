package com.agrohackaton;

import com.agrohackaton.application.AgroHackatonImpl;
import com.agrohackaton.application.AgroHackatonServer;
import com.agrohackaton.config.CorsConfig;
import com.agrohackaton.config.MorphiaConfig;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.glassfish.jersey.servlet.ServletContainer;
import org.mongodb.morphia.Datastore;

public class ApiMain {
    protected static Datastore datastore = new MorphiaConfig("hackaton").getDatastore();

    protected static AgroHackatonServer agroHackatonServer = new AgroHackatonImpl(datastore);

    public static void main(String[] args) throws Exception {
        Server server = new Server(8100);

        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
        context.setContextPath("/");
        server.setHandler(context);
        ServletHolder jerseyServlet = context.addServlet(ServletContainer.class, "/api/*");
        jerseyServlet.setInitOrder(0);
        jerseyServlet.setInitParameter("jersey.config.server.provider.packages", "com.agrohackaton.api.services");
        context.addFilter(CorsConfig.class, "/*", null);

        server.start();
        server.join();
    }
}