package ml.chessboard.web;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class ChessboardServlet extends HttpServlet {
    public static final String FIND_ALL_SERVLET_PATH = "/all";
    public static final String INDEX_PAGE = "/html/index.html";
    
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String servletPath = request.getServletPath();
        String view = processRequest(servletPath, request);
        RequestDispatcher dispatcher = request.getRequestDispatcher(view);
        dispatcher.forward(request, response);
    }

    private String processRequest(String servletPath, HttpServletRequest request) {
        /*if(servletPath.equals(FIND_ALL_SERVLET_PATH)) {
            List<ToDoItem> toDoItems = toDoRepository.findAll();
            request.setAttribute("toDoItems", toDoItems);
            request.setAttribute("stats", determineStats(toDoItems));
            request.setAttribute("filter", "all");
            return INDEX_PAGE;
        }
        else if(servletPath.equals("/active")) {
            List<ToDoItem> toDoItems = toDoRepository.findAll();
            request.setAttribute("toDoItems", filterBasedOnStatus(toDoItems, true));
            request.setAttribute("stats", determineStats(toDoItems));
            request.setAttribute("filter", "active");
            return INDEX_PAGE;
        }
        else if(servletPath.equals("/completed")) {
            List<ToDoItem> toDoItems = toDoRepository.findAll();
            request.setAttribute("toDoItems", filterBasedOnStatus(toDoItems, false));
            request.setAttribute("stats", determineStats(toDoItems));
            request.setAttribute("filter", "completed");
            return INDEX_PAGE;
        }
        if(servletPath.equals("/insert")) {
            ToDoItem toDoItem = new ToDoItem();
            toDoItem.setName(request.getParameter("name"));
            toDoRepository.insert(toDoItem);
            return "/" + request.getParameter("filter");
        }
        else if(servletPath.equals("/update")) {
            ToDoItem toDoItem = toDoRepository.findById(Long.parseLong(request.getParameter("id")));

            if(toDoItem != null) {
                toDoItem.setName(request.getParameter("name"));
                toDoRepository.update(toDoItem);
            }

            return "/" + request.getParameter("filter");
        }
        else if(servletPath.equals("/delete")) {
            ToDoItem toDoItem = toDoRepository.findById(Long.parseLong(request.getParameter("id")));

            if(toDoItem != null) {
                toDoRepository.delete(toDoItem);
            }

            return "/" + request.getParameter("filter");
        }
        else if(servletPath.equals("/toggleStatus")) {
            ToDoItem toDoItem = toDoRepository.findById(Long.parseLong(request.getParameter("id")));

            if(toDoItem != null) {
                boolean completed = "on".equals(request.getParameter("toggle")) ? true : false;
                toDoItem.setCompleted(completed);
                toDoRepository.update(toDoItem);
            }

            return "/" + request.getParameter("filter");
        }
        else if(servletPath.equals("/clearCompleted")) {
            List<ToDoItem> toDoItems = toDoRepository.findAll();

            for(ToDoItem toDoItem : toDoItems) {
                if(toDoItem.isCompleted()) {
                    toDoRepository.delete(toDoItem);
                }
            }

            return "/" + request.getParameter("filter");
        }*/

        return FIND_ALL_SERVLET_PATH;
    }
}