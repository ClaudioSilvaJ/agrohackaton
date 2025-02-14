package com.agrohackaton.api.services;

import com.agrohackaton.ApiMain;
import com.agrohackaton.application.base.Aviary;
import com.agrohackaton.application.base.AviaryRelatory;

import javax.ws.rs.*;
import java.util.List;

@Path("/")
public class AdminServices extends ApiMain {

    @POST
    @Path("/create-aviary")
    public String createAviary(Aviary aviary){
        agroHackatonServer.aviarys().createAviary(aviary);
        return "Aviary created!";
    }


    @GET
    @Path("/list-aviaries")
    @Produces("application/json")
    public List<Aviary> listAviaries(){
        return agroHackatonServer.aviarys().listAviaries();
    }


    @GET
    @Path("/calcular-dashboard")
    public AviaryRelatory calcularDashboard(@QueryParam("aviaryId") String aviaryId){
        Aviary aviary = agroHackatonServer.aviarys().getAviary(aviaryId);
        return agroHackatonServer.aviarys().generateRelatory(aviary);
    }

}
