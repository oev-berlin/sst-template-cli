use auth_git2::GitAuthenticator;
use cliclack;
use console::style;
use std::path::Path;
use std::process::exit;

fn main() -> std::io::Result<()> {
    let auth = GitAuthenticator::default();

    // clear the screen
    cliclack::clear_screen()?;

    // Set the title and the color theme
    cliclack::intro(style(" create-project ").on_green().black())?;

    // Ask for project Path
    let path: String = cliclack::input("Where should we create your project?")
        .placeholder("./")
        .default_input("./")
        .validate(|input: &String| {
            if input.is_empty() {
                Err("Please enter a path.")
            } else if !input.starts_with("./") {
                Err("Please enter a relative path which start with './'")
            } else {
                Ok(())
            }
        })
        .interact()?;

    // Ask for the project name
    let project_name: String = cliclack::input("Where should we create your project?")
        .placeholder("sample-project")
        .default_input("sample-project")
        .interact()?;

    // Ask if it should be an SST project (Maybe for later)
    let sst: bool = cliclack::confirm("Should this be an SST project?")
        .initial_value(false)
        .interact()?;

    // Define the templates
    let templates = &[
        ("oev", "OEV - Template", "recommended"),
        ("next", "Next", ""),
        ("react", "React", ""),
        ("astro", "Astro", ""),
        ("vue", "Vue", ""),
    ];

    // Let the user choose a template
    let selected_template = cliclack::select("Select an application template")
        .initial_value("oev")
        .items(templates)
        .interact()?;

    let _ = cliclack::log::info(format!("Selected template: {selected_template}"));

    // URLs for the templates (replace with actual URLs)
    let urls = vec![
        "git@github.com:id-fabrik/after-work.git", // TODO: update to accroding repositories
        "https://github.com/user/template2.git",
        "https://github.com/user/template3.git",
    ];

    // Get the URL for the selected template
    let url = match selected_template {
        "oev" => urls[0],
        "next" => urls[1],
        "react" => urls[2],
        "astro" => urls[3],
        "vue" => urls[4],
        _ => {
            println!("Invalid selection");
            exit(1);
        }
    };

    let mut path_str = String::new();
    path_str.push_str(&path);
    path_str.push_str(&project_name);

    let project_path = Path::new(&path_str);

    cliclack::spinner().start("Cloning"); // TODO: spinner should run while cloning and stopped when finished

    let _ = auth.clone_repo(url, project_path); // TODO: add error handling -> if passphrse is wrong no error is thrown

    Ok(())
}
