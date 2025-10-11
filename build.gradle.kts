plugins {
    java
    id("org.springframework.boot") version "3.5.5"
    id("io.spring.dependency-management") version "1.1.7"
    id("org.openapi.generator") version "7.5.0"
}

group = "org.moysha"
version = "0.0.1-SNAPSHOT"
description = "IsLab1"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(19)
    }
}

repositories {
    mavenCentral()
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-websocket")

    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.9")

    implementation("io.jsonwebtoken:jjwt-api:0.12.6")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.6")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.6")

    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")

    implementation("org.apache.commons:commons-lang3:3.18.0")

    developmentOnly("org.springframework.boot:spring-boot-devtools")
    developmentOnly("org.springframework.boot:spring-boot-docker-compose")

    runtimeOnly("org.postgresql:postgresql")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

//openApiGenerate {
//    inputSpec.set("$projectDir/src/main/resources/openapi/openapi.yaml")
//    generatorName.set("spring")
//    library.set("spring-boot")
//    apiPackage.set("org.moysha.islab1.generated.api")
//    modelPackage.set("org.moysha.islab1.generated.model")
//    invokerPackage.set("org.moysha.islab1.generated.invoker")
//    configOptions.set(
//        mapOf(
//            "interfaceOnly" to "true",
//            "useTags" to "true",
//            "dateLibrary" to "java8",
//            "useSpringBoot3" to "true",
//            "openApiNullable" to "false"
//        )
//    )
//    generateApiTests.set(false)
//    generateModelTests.set(false)
//    skipValidateSpec.set(false)
//
//    // ГЕНЕРИРУЕМ В build/
//    outputDir.set("$buildDir/generated/openapi")
//}
//
//sourceSets {
//    main {
//        java {
//            srcDir("$buildDir/generated/openapi/src/main/java")
//        }
//        resources {
//            srcDir("src/main/resources")
//        }
//    }
//}

tasks.withType<JavaCompile> {
    options.encoding = "UTF-8"
}

//tasks.register("generateOpenApi") {
//    dependsOn("openApiGenerate")
//}
//
//tasks.named("compileJava") {
//    dependsOn("openApiGenerate")
//}

tasks.withType<Test> {
    useJUnitPlatform()
}


//        tasks.withType<ProcessResources> {
//            duplicatesStrategy = DuplicatesStrategy.EXCLUDE
//            exclude("openapi/**")
//        }
