{% include '.partials/java-package' -%}
import java.util.HashMap;

public class {{ messageName }} { 

    // Headers with their getters and setters.
    private HashMap<String, Object> headers = new HashMap<>();
{% for name, prop in message.json().headers.properties -%}
{%- set type = prop.type | fixType %}
    private {{ type }} {{ name }};
{% endfor %}

{%- for name, prop in message.json().headers.properties -%}
{%- set type = prop.type | fixType %}
    public {{ type }} get{{- name | upperFirst }}() {
        return {{ name }};
    }

    public void set{{- name | upperFirst }}( {{ type }} {{ name }} ) {
        this.{{-name }} = {{ name }};
        headers.put("{{ name }}", {{ name }});
    }

{% endfor %}
    // Payload
{%- set type = message.json().payload.title | upperFirst %}
{% set name = message.json().payload.title | lowerFirst %}

    private {{ type }} {{ name }};

    public {{ type | upperFirst }} getPayload() {
        return {{ type | lowerFirst }};
    }

    public void setPayload({{ type | upperFirst }} {{ type | lowerFirst }}) {
        this.{{- name }} = {{ name }};
    }
}
