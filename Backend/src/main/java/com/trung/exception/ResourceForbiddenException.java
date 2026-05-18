package com.trung.exception;

import lombok.Getter;

import java.util.Map;

@Getter
public class ResourceForbiddenException extends Exception{
    public ResourceForbiddenException(String message){
        super(message);
    }
}
