package org.moysha.islab1.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UploadDragonsDTO {

    @JsonAlias({"dragonsJson", "dragons_json"})
    private String dragonsJson;

    public UploadDragonsDTO() {}

    public String getDragonsJson() { return dragonsJson; }
    public void setDragonsJson(String dragonsJson) { this.dragonsJson = dragonsJson; }

    @Override public String toString() {
        return "UploadDragonsDTO(dragonsJson=" + dragonsJson + ")";
    }
}
