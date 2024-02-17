package ru.kata.spring.boot_security.demo.ErrorHandler;

public class ErrorsInfoHandler {

    private String info;

    public ErrorsInfoHandler(String info) {
        this.info = info;
    }

    public ErrorsInfoHandler() {
    }

    public String getInfo() {
        return info;
    }

    public ErrorsInfoHandler getInstanceWithInfo(String info) {
        return new ErrorsInfoHandler(info);
    }
}
