package com.solace.bean.event;

public class {{ schemaName }} { 
{% for name, prop in schema.properties() -%}
{%- set type = prop.type() | fixType %}
private {{ type }} {{ name }};
{%- endfor %}

{% for name, prop in schema.properties() -%}
{%- set type = prop.type() | fixType %}
public {{ type }} get{{- name | upperFirst }}() {
    return {{ name }};
}

public void set{{- name | upperFirst }}( {{ type }} {{ name }} ) {
    this.{{-name }} = {{ name }};
}

{% endfor %}
}
